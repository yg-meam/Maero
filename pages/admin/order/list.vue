<template>
  <v-layout fill-height column>
    <v-flex class="section-box">
      <v-layout fill-height column>
        <div>
          <v-layout align-center>
            <div class="header">주문내역</div>
            <v-spacer></v-spacer>
            <div>
              <file-input @change="changeFile">
                <v-btn color="primary" outlined>추가</v-btn>
              </file-input>
            </div>
          </v-layout>
        </div>

        <div class="filter">
          <v-layout>
            <div>
              <v-select
                hide-details
                solo
                flat
                dense
                class="mr-2 mb-6"
                v-model="filter.searchType"
                :items="searchTypes"
                label="검색항목 입력"
              >
              </v-select>
              <div class="ml-2">
                {{ count - uncount + "/" + this.orderList.length }}
              </div>
            </div>
            <div>
              <v-textarea
                hide-details
                solo
                flat
                dense
                :rows="3"
                class="mr-2"
                v-model="filter.keyword"
                placeholder="검색어를 입력해주세요"
              ></v-textarea>
            </div>

            <div>
              <date-picker dense v-model="filter.startDate"></date-picker>
            </div>

            <div class="ml-2 mr-2">-</div>

            <div>
              <date-picker dense v-model="filter.endDate"></date-picker>
            </div>
            <div class="ml-2 mr-1"></div>
            <v-btn outlined @click="changeFilter">검색</v-btn>
            <div>
              <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="ml-2" outlined v-bind="attrs" v-on="on">
                    스캐너
                  </v-btn>
                </template>

                <v-card class="pa-4">
                  <new-barcode></new-barcode>
                  <div class="pa-2"></div>
                  <v-layout align-center>
                    <v-textarea
                      auto-grow
                      hide-details
                      solo
                      flat
                      :rows="1"
                      v-model="searchOrder"
                      @keyup="scanStart"
                      placeholder="바코드를 스캔해주세요"
                    ></v-textarea>
                    <!-- <v-btn @click="scannOrder">검색</v-btn> -->
                  </v-layout>
                </v-card>
              </v-dialog>
            </div>
          </v-layout>
        </div>
        <div class="pb-2"></div>
        <div class="background">
          <v-layout align-center>
            <div>
              <v-textarea
                hide-details
                solo
                flat
                :rows="1"
                class="mr-2"
                v-model="selectText"
                placeholder="선택 된 셀 내용 표시"
              ></v-textarea>
            </div>
            <v-spacer></v-spacer>
            <div>
              <v-select
                hide-details
                solo
                flat
                dense
                class="mr-2 selectBox"
                v-model="changeType"
                :items="changeTypes"
                label="상태"
                @change="changeStatus"
              >
              </v-select>
            </div>
            <div>
              <v-select
                hide-details
                solo
                flat
                dense
                class="mr-2 selectBox"
                v-model="downType"
                :items="downTypes"
                label="다운로드"
                @click="download"
              >
              </v-select>
            </div>
            <div>
              <v-btn outlined @click="cancleSelect">취소</v-btn>
            </div>
            <div>
              <v-btn class="ml-2" outlined @click="deleteSelect">삭제</v-btn>
            </div>
            <div>
              <v-btn class="ml-2" outlined @click="orderSheet"
                >주문서 출력</v-btn
              >
            </div>
            <div>
              <v-btn class="ml-2" outlined @click="completion">발송완료</v-btn>
            </div>
          </v-layout>
        </div>
        <v-flex>
          <no-ssr>
            <grid
              class="mt-2"
              ref="grid1"
              :data="orderList"
              :rowHeaders="rowHeaders"
              :columnOptions="columnOptions"
              :columns="columns"
              :scrollX="true"
              bodyHeight="fitToParent"
              :scrollY="true"
              :contextMenu="contextMenu"
              theme="clean"
              @afterChange="valueChange"
              @click="gridClick"
              @check="check"
              @uncheck="uncheck"
              @checkAll="checkAll"
              @uncheckAll="uncheckAll"
            ></grid>
          </no-ssr>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-dialog
      v-model="scannerDialog.visible"
      max-width="800"
      v-if="scannerDialog.visible"
    >
      <v-card>
        <iframe id="Web" :src="popupUrl" width="800" height="800"> </iframe>
        <v-card class="pa-4">
          <v-textarea
            class="input mt-2"
            auto-grow
            hide-details
            solo
            flat
            :rows="1"
            label="포장번호"
            v-model="packagNo"
          ></v-textarea>

          <v-select
            class="mt-2"
            hide-details
            solo
            flat
            outlined
            v-model="boxNo"
            label="상자번호"
            :items="boxNumber"
          ></v-select>

          <v-textarea
            class="input mt-2"
            auto-grow
            hide-details
            solo
            flat
            :rows="1"
            v-model="allBox"
            label="총중량"
          ></v-textarea>
          <v-btn class="mt-2" width="370" outlined @click="closePage"
            >닫기</v-btn
          >
          <v-btn class="mt-2 mr-2" width="370" outlined @click="changeList"
            >상태변경</v-btn
          >
        </v-card>
      </v-card>
    </v-dialog>

    <v-dialog v-model="history.visible" max-width="1000" v-if="history.visible">
      <v-card>
        <no-ssr>
          <grid
            class="mt-2"
            ref="grid2"
            :data="historyDataList"
            :columns="field"
            bodyHeight="fitToParent"
            :scrollX="true"
            :scrollY="true"
            theme="clean"
          ></grid>
        </no-ssr>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import numeral from "numeral";
import moment from "moment";
import _ from "underscore";
import orderStatus from "@/data/orderStatus";
import orderType from "@/data/orderType";
import changeType from "@/data/changeType";
import Vue from "vue";
export default {
  data() {
    return {
      popupUrl: "",
      searchPromise: null,
      orderList: [],
      historyDataList: [],
      searchType: null,
      changeType: null,
      downType: null,
      boxNo: null,
      keyword: "",
      selectText: "",
      searchOrder: "",
      packagNo: "",
      allBox: "",
      dialog: false,
      count: 0,
      uncount: 0,
      history: {
        visible: false,
        orderItem: null,
      },
      scannerDialog: {
        visible: false,
        orderItem: null,
      },
      filter: {
        searchType: null,
        keyword: "",
        startDate: null,
        endDate: moment().format("YYYY-MM-DD"),
      },
      searchTypes: [
        { text: "전체", value: null },
        { text: "주문ID", value: "tradeId" },
        { text: "상품ID", value: "productId" },
        { text: "상품명", value: "productName" },
        { text: "구매자ID", value: "buyerId" },
      ],
      changeTypes: [
        { text: "상태", value: null },
        { text: "발주전", value: "100" },
        { text: "발주대기", value: "200" },
        { text: "발주완료", value: "300" },
        { text: "수령완료", value: "400" },
        { text: "검품완료", value: "500" },
        { text: "포장완료", value: "600" },
        { text: "발송완료", value: "700" },
        { text: "불량처리", value: "800" },
        { text: "품절", value: "900" },
        { text: "취소", value: "1000" },
        { text: "일부수령", value: "1100" },
        { text: "브랜드문의", value: "1200" },
        { text: "손님문의", value: "1300" },
        { text: "클레임", value: "1400" },
      ],
      downTypes: [
        { text: "다운로드", value: null },
        { text: "발송시트 엑셀 다운로드" },
        { text: "검품포장시트 다운로드" },
        { text: "KSE 엑셀 다운로드" },
        { text: "우체국 엑셀 다운로드" },
        { text: "주소확인시트 다운로드" },
      ],
      boxNumber: [
        { text: "60", value: "60" },
        { text: "70", value: "70" },
        { text: "90", value: "90" },
        { text: "100", value: "100" },
        { text: "130", value: "130" },
        { text: "150", value: "150" },
        { text: "180", value: "180" },
        { text: "200", value: "200" },
      ],
      search: {
        searchType: this.searchType,
        keyword: this.keyword,
      },
      rowHeaders: ["checkbox"],
      //shopUrlList: false,
      // shopList: [],
      columnOptions: {
        resizable: true,
      },
      contextMenu: ({ rowKey, columnName }) => [
        [
          {
            name: "popUp",
            label: "팝업페이지",
            action: () => {
              this.popupPage(this.orderList[rowKey]);
            },
          },
          {
            name: "pages",
            label: "상세페이지",
            subMenu: [
              {
                name: "orderPages",
                label: "주문페이지",
                action: () => {},
              },
              {
                name: "shop",
                label: "매입처",
                action: () => {},
              },
            ],
          },
          {
            name: "orderPrint",
            label: "주문서인쇄",
            action: () => {},
          },
          {
            name: "statusChange",
            label: "상태변경",
            subMenu: [
              {
                name: "100",
                label: "발주전",
                action: () => {
                  this.changeStatusList(rowKey, 100);
                },
              },
              {
                name: "200",
                label: "발주대기",
                action: () => {
                  this.changeStatusList(rowKey, 200);
                },
              },
              {
                name: "300",
                label: "발주완료",
                action: () => {
                  this.changeStatusList(rowKey, 300);
                },
              },
              {
                name: "400",
                label: "수령완료",
                action: () => {
                  this.changeStatusList(rowKey, 400);
                },
              },
              {
                name: "500",
                label: "검품완료",
                action: () => {
                  this.changeStatusList(rowKey, 500);
                },
              },
              {
                name: "600",
                label: "포장완료",
                action: () => {
                  this.changeStatusList(rowKey, 600);
                },
              },
              {
                name: "700",
                label: "발송완료",
                action: () => {
                  this.changeStatusList(rowKey, 700);
                },
              },
              {
                name: "800",
                label: "불량처리",
                action: () => {
                  this.changeStatusList(rowKey, 800);
                },
              },
              {
                name: "900",
                label: "품절",
                action: () => {
                  this.changeStatusList(rowKey, 900);
                },
              },
              {
                name: "1000",
                label: "취소",
                action: () => {
                  this.changeStatusList(rowKey, 1000);
                },
              },
              {
                name: "1100",
                label: "일부수령",
                action: () => {
                  this.changeStatusList(rowKey, 1100);
                },
              },
              {
                name: "1200",
                label: "브랜드문의",
                action: () => {
                  this.changeStatusList(rowKey, 1200);
                },
              },
              {
                name: "1300",
                label: "손님문의",
                action: () => {
                  this.changeStatusList(rowKey, 1300);
                },
              },
              {
                name: "1400",
                label: "클레임",
                action: () => {
                  this.changeStatusList(rowKey, 1400);
                },
              },
            ],
          },
          {
            name: "delete",
            label: "삭제",
            action: () => {
              this.removeOrderDate(this.orderList[rowKey], columnName);
            },
          },
          {
            name: "deleteColumn",
            label: "행 삭제",
            action: () => {
              this.removeData(this.orderList[rowKey]);
            },
          },
          {
            name: "history",
            label: "히스토리",
            action: () => {
              this.histroyPage(this.orderList[rowKey]);
            },
          },
        ],
      ],
      field: [
        {
          header: "사용자ID",
          name: "UserId",
          width: 150,
          align: "center",
        },
        {
          header: "주문ID",
          name: "orderKey",
          width: 150,
          align: "center",
        },
        {
          header: "변경된 필드",
          name: "changeField",
          width: 150,
          align: "center",
          formatter(item) {
            if (item.value) {
              var finded = _.find(changeType, (changeValue) => {
                return changeValue.value == item.value;
              });
              if (finded) {
                return finded.text;
              }
            }
          },
        },
        {
          header: "변경된 데이터",
          name: "changeValue",
          width: 200,
          align: "center",
        },
        {
          header: "이전 데이터",
          name: "prevValue",
          width: 200,
          align: "center",
        },
        {
          header: "변경된 날짜",
          name: "createDate",
          width: 100,
          align: "center",
          formatter(item) {
            if (item.value) {
              return moment(item.value).format("YYYY-MM-DD");
            }
          },
        },
      ],
      columns: [
        {
          header: "상태",
          name: "status",
          width: 100,
          align: "center",
          filter: "select",
          sortable: true,
          copyOptions: {
            customValue(value) {
              if (value) {
                var finded = _.find(orderStatus, (status) => {
                  return status.value == value;
                });
                if (finded) {
                  return finded.text;
                }
              }
            },
          },
          formatter(item) {
            if (item.value) {
              var finded = _.find(orderStatus, (status) => {
                return status.value == item.value;
              });
              if (finded) {
                return finded.text;
              }
            }
          },
          editor: {
            type: "select",
            options: {
              listItems: orderStatus,
            },
          },
        },
        {
          header: "판매처",
          name: "orderType",
          width: 100,
          align: "center",
          filter: "select",
          sortable: true,
          copyOptions: {
            customValue(value) {
              if (value) {
                var finded = _.find(orderType, (status) => {
                  return status.value == value;
                });
                if (finded) {
                  return finded.text;
                }
              }
            },
          },
          formatter(item) {
            // if (item.value == 1) {
            //   return "BUYMA";
            // } else if (item.value == 2) {
            //   return "QOO10";
            // } else if (item.value == 3) {
            //   return "RAKUTEN";
            // }
            if (item.value) {
              var finded = _.find(orderType, (status) => {
                return status.value == item.value;
              });
              if (finded) {
                return finded.text;
              }
            }
          },
        },
        {
          header: "주문일",
          name: "orderDate",
          width: 120,
          align: "center",
          filter: "select",
          editor: {
            type: "datePicker",
            options: {
              language: "ko",
              autoClose: true,
            },
          },
          sortable: true,
          formatter(item) {
            if (item.value) {
              return moment(item.value).format("YYYY-MM-DD");
            }
          },
        },
        {
          header: "발송기한",
          name: "deliveryExpireDate",
          width: 120,
          align: "center",
          filter: "select",
          sortable: true,
          formatter(item) {
            if (item.value) {
              return moment(item.value).format("YYYY-MM-DD");
            }
          },
        },
        {
          header: "발송일",
          name: "deleveryStartDate",
          width: 120,
          align: "center",
          filter: "select",
          sortable: true,
          formatter(item) {
            if (item.value) {
              return moment(item.value).format("YYYY-MM-DD");
            }
          },
        },
        {
          header: "주문알림",
          name: "orderNotice",
          width: 100,
          align: "center",
          filter: "select",
          sortable: true,
        },
        {
          header: "발송메모",
          name: "deleveryMemo",
          width: 150,
          align: "left",
          filter: "select",
          sortable: true,
          editor: "text",
        },
        {
          header: "주문ID",
          name: "tradeId",
          width: 120,
          align: "center",
          filter: "select",
          sortable: true,
        },
        {
          header: "상품ID",
          name: "productId",
          width: 130,
          align: "center",
          filter: "select",
          sortable: true,
        },
        {
          header: "브랜드",
          name: "brandMemo",
          width: 100,
          editor: "text",
          align: "left",
          filter: "select",
          sortable: true,
        },
        {
          header: "상품명",
          name: "productName",
          width: 250,
          filter: "select",
          sortable: true,
        },
        {
          header: "주문수량",
          name: "orderNumber",
          width: 100,
          align: "right",
          editor: "text",
          filter: "select",
          sortable: true,
        },
        {
          header: "옵션",
          name: "colorSize",
          width: 150,
          align: "right",
          editor: "text",
          filter: "select",
          sortable: true,
        },
        {
          header: "발주메모",
          name: "orderMemo",
          width: 100,
          editor: "text",
          align: "left",
          filter: "select",
          sortable: true,
        },
        {
          header: "매입처",
          name: "partnerShop",
          width: 100,
          align: "left",
          editor: "text",
          filter: "select",
          sortable: true,
          // formatter: (item) => {
          //   if (item.value) {
          //     var finded = _.find(this.shopList, (shop) => {
          //       return shop.value == item.value;
          //     });
          //     if (finded) {
          //       return finded.text;
          //     }
          //   }
          // },
          // editor: {
          //   type: "select",
          //   options: {
          //     listItems: [],
          //   },
          // },
        },
        {
          header: "매입가",
          name: "partnerPrice",
          width: 100,
          editor: "text",
          align: "right",
          filter: "select",
          sortable: true,
          formatter: (row) => {
            if (row.value) {
              return numeral(row.value).format("0,000");
            }
          },
        },
        {
          header: "판매가",
          name: "orderPrice",
          width: 150,
          align: "right",
          filter: "select",
          sortable: true,
          formatter: (row) => {
            if (row.value) {
              return numeral(row.value).format("0,000");
            }
          },
        },
        {
          header: "주문번호",
          name: "partnerOrderNo",
          width: 100,
          editor: "text",
          align: "left",
          filter: "select",
          sortable: true,
        },
        {
          header: "매입일",
          name: "partnerOrderDate",
          width: 100,
          align: "center",
          filter: "select",
          sortable: true,
          formatter: (row) => {
            if (row.value) {
              return moment(row.value).format("YYYY-MM-DD");
            }
          },
        },
        // {
        //   header: "출품메모",
        //   name: "memo",
        //   width: 200,
        //   align: "left",
        // },
        {
          header: "운송방법",
          name: "deliveryType",
          width: 200,
          editor: "text",
          align: "left",
          filter: "select",
          sortable: true,
        },
        {
          header: "구매자ID",
          name: "buyerId",
          width: 200,
          align: "center",
          sortable: true,
          filter: "select",
        },
        {
          header: "연락사항",
          name: "buyerPhone",
          width: 200,
          align: "left",
          filter: "select",
          sortable: true,
        },
        // {
        //   header: "상자",
        //   name: "PackageId",
        //   width: 80,
        //   align: "center",
        //   editor: {
        //     type: "select",
        //     options: {
        //       listItems: [
        //         {
        //           text: "60",
        //           value: 60,
        //         },
        //         {
        //           text: "70",
        //           value: 70,
        //         },
        //         {
        //           text: "90",
        //           value: 90,
        //         },
        //         {
        //           text: "100",
        //           value: 100,
        //         },
        //         {
        //           text: "130",
        //           value: 130,
        //         },
        //         {
        //           text: "150",
        //           value: 150,
        //         },
        //         {
        //           text: "180",
        //           value: 180,
        //         },
        //         {
        //           text: "200",
        //           value: 200,
        //         },
        //       ],
        //     },
        //   },
        // },
        // {
        //   header: "WIDTH",
        //   name: "horizontal",
        //   width: 80,
        //   align: "center",
        //   formatter(data) {
        //     if (data.row.package) {
        //       return data.row.package.horizontal;
        //     }
        //   },
        // },
        // {
        //   header: "LENGTH",
        //   name: "vertical",
        //   width: 80,
        //   align: "center",
        //   formatter(data) {
        //     if (data.row.package) {
        //       return data.row.package.vertical;
        //     }
        //   },
        // },
        // {
        //   header: "HEIGHT",
        //   name: "height",
        //   width: 80,
        //   align: "center",
        //   formatter(data) {
        //     if (data.row.package) {
        //       return data.row.package.height;
        //     }
        //   },
        // },
      ],
    };
  },
  mounted() {
    this.getOrderList();
    // this.getHistoryDataList();
    //this.getShopList();
  },
  methods: {
    check() {
      var checkBoxList = this.$refs.grid1.invoke("getCheckedRows");
      this.count = checkBoxList.length;
      this.uncount = 0;
    },
    uncheck() {
      var uncheckBoxList = this.$refs.grid1.invoke("getCheckedRows");
      this.uncount = this.count - uncheckBoxList.length;
    },
    checkAll() {
      var allCheckBoxList = this.$refs.grid1.invoke("getCheckedRows");
      this.count = allCheckBoxList.length;
    },
    uncheckAll() {
      var unAllCheckBoxList = this.$refs.grid1.invoke("getCheckedRows");
      this.uncount = this.count - unAllCheckBoxList.length;
    },
    histroyPage(orderItem) {
      var historyData = [];
      var Object = {
        id: orderItem.id,
      };
      historyData.push(Object);

      this.$axios.post("/admin/order/history", historyData).then((result) => {
        if (result.data.res) {
          this.history.visible = true;
          Vue.nextTick(() => {
            this.historyDataList = result.data.checkedList;

            this.$refs.grid2.invoke("resetData", this.historyDataList);
            this.$refs.grid2.invoke("refreshLayout");
            this.$refs.grid1.invoke("resetData", this.orderList);
          });
        }
      });
    },
    completion() {
      var checkBoxList = this.$refs.grid1.invoke("getCheckedRows");

      var checkList = _.map(checkBoxList, (item) => {
        return {
          id: item.id,
          status: 700,
        };
      });

      if (checkBoxList == 0) {
        return window.alert("'발송완료'할 항목을 선택해주세요");
      } else {
        this.$axios.post("/admin/order/update", checkList).then((result) => {
          if (result.data.res) {
            this.getOrderList();
          }
        });
      }
    },
    orderSheet() {},
    removeData(orderItem) {
      var removeColumn = [];
      var Object = {
        id: orderItem.id,
      };
      removeColumn.push(Object);

      this.$axios.post("/admin/order/remove", removeColumn).then((result) => {
        if (result.data.res) {
          this.getOrderList();
        }
      });
    },
    removeData(orderItem) {
      var removeColumn = [];
      var Object = {
        id: orderItem.id,
      };
      removeColumn.push(Object);

      this.$axios.post("/admin/order/remove", removeColumn).then((result) => {
        if (result.data.res) {
          this.getOrderList();
        }
      });
    },
    deleteSelect() {
      var checkBoxList = this.$refs.grid1.invoke("getCheckedRows");

      var checkList = _.map(checkBoxList, (item) => {
        return {
          id: item.id,
        };
      });

      if (checkBoxList == 0) {
        return window.alert("삭제할 주문목록을 선택해주세요");
      } else {
        this.$axios.post("/admin/order/remove", checkList).then((result) => {
          if (result.data.res) {
            this.getOrderList();
          }
        });
      }
    },
    scanStart() {
      if (this.searchPromise) {
        clearTimeout(this.searchPromise);
      }
      this.searchPromise = setTimeout(() => {
        this.$axios
          .post("admin/order/scanner", { tradeId: this.searchOrder })
          .then((result) => {
            if (result.data.status == "no") {
              return window.alert("주문ID가 일치하지 않습니다");
            } else {
              this.popupPage(result.data.item);
            }
          });
      }, 500);
    },
    changeList() {
      if (!this.packagNo) {
        return window.alert("포장번호를 입력하세요");
      } else if (!this.boxNo) {
        return window.alert("상자번호를 입력하세요");
      } else if (!this.allBox) {
        return window.alert("총중량을 입력하세요");
      }
      var popDataList = [];
      var popObject = {
        number: this.packagNo,
        PackageId: this.boxNo,
        packageSum: this.allBox,
        id: this.scannerDialog.orderItem.id,
      };
      popDataList.push(popObject);
      this.$axios.post("/admin/order/update", popDataList).then((result) => {
        if (result.data.res) {
          _.each(result.data.changedList, (changeItem) => {
            var index = _.findIndex(this.orderList, (orderItem) => {
              return orderItem.id == changeItem.id;
            });
            this.orderList[index] = changeItem;
            this.setRow(index, changeItem);
          });
          this.scannerDialog.visible = false;
          this.packagNo = null;
          this.boxNo = null;
          this.allBox = null;
          this.dialog = null;
          this.searchOrder = null;
        }
      });
    },
    popupPage(orderItem) {
      this.scannerDialog.orderItem = orderItem;
      Vue.nextTick(() => {
        if (orderItem.orderType == 1) {
          this.popupUrl = `https://www.buyma.com/my/buyerorderdetail/?tid=${orderItem.tradeId}`;
          //  console.log(this.popupUrl);
          this.scannerDialog.visible = true;
        } else if (orderItem.orderType == 2) {
          this.popupUrl = `https://www.qoo10.jp/g/${orderItem.productId}`;
          //console.log(this.popupUrl);
          this.scannerDialog.visible = true;
        } else if (orderItem.orderType == 3) {
          this.popupUrl = `https://item.rakuten.co.jp/seoulcollection/${orderItem.productId}`;
          //console.log(this.popupUrl);
          this.scannerDialog.visible = true;
        }
      });
    },
    closePage() {
      this.scannerDialog.visible = false;
      this.dialog = false;
      this.searchOrder = null;
      this.packagNo = null;
      this.boxNo = null;
      this.allBox = null;
    },
    // scannOrder() {
    //   console.log(this.searchOrder);
    //   if (!this.searchOrder) {
    //     return window.alert("주문ID를 입력해주세요");
    //   }
    //   this.$axios
    //     .post("admin/order/scanner", { tradeId: this.searchOrder })
    //     .then((result) => {
    //       console.log(result.data.status);
    //       if (result.data.status == "no") {
    //         return window.alert("주문ID가 일치하지 않습니다");
    //       } else if (result.data.item.orderType == "1") {
    //         this.popupUrl = `https://www.buyma.com/my/buyerorderdetail/?tid=${result.data.item.tradeId}`;
    //         console.log(this.popupUrl);
    //         this.scannerDialog.visible = true;
    //       } else if (result.data.item.orderType == "2") {
    //         this.popupUrl = `https://www.qoo10.jp/g/${result.data.item.productId}`;
    //         console.log(this.popupUrl);
    //         this.scannerDialog.visible = true;
    //       } else if (result.data.item.orderType == "3") {
    //         this.popupUrl = `https://item.rakuten.co.jp/seoulcollection/${result.data.item.productId}`;
    //         console.log(this.popupUrl);
    //         this.scannerDialog.visible = true;
    //       }
    //     });
    // },
    gridClick(event) {
      if (event.targetType == "cell") {
        if (
          [
            "deleveryMemo",
            "tradeId",
            "productId",
            "brandMemo",
            "productName",
            "colorSize",
            "orderMemo",
            "partnerShop",
            "partnerPrice",
            "orderPrice",
            "partnerOrderNo",
            "deliveryType",
          ].indexOf(event.columnName) > -1
        ) {
          this.selectText = this.orderList[event.rowKey][event.columnName];
        }
      }

      // this.selectText.push(this.orderList[event.rowKey][event.columnName]);
    },
    removeOrderDate(orderItem, column) {
      var removeDateList = [];

      var removeObject = {
        id: orderItem.id,
      };
      removeObject[column] = null;

      removeDateList.push(removeObject);

      this.$axios.post("/admin/order/update", removeDateList).then((result) => {
        if (result.data.res) {
          _.each(result.data.changedList, (changeItem) => {
            var index = _.findIndex(this.orderList, (orderItem) => {
              return orderItem.id == changeItem.id;
            });
            this.orderList[index] = changeItem;

            this.setRow(index, changeItem);
          });
          this.$refs.grid1.invoke("refreshLayout");
        }
      });
    },
    changeStatusList(rowKey, status) {
      var changeStatusSelect = this.$refs.grid1.invoke("getSelectionRange");
      var startSelect;
      var endSelect;
      if (changeStatusSelect) {
        startSelect = changeStatusSelect.start[0];
        endSelect = changeStatusSelect.end[0];
      } else {
        startSelect = rowKey;
        endSelect = rowKey;
      }

      var list = [];

      for (var i = startSelect; i <= endSelect; i++) {
        var item = this.orderList[i];
        list.push({
          id: item.id,
          status: status,
        });
      }
      this.$axios.post("/admin/order/update", list).then((result) => {
        if (result.data.res) {
          _.each(result.data.changedList, (changeItem) => {
            var index = _.findIndex(this.orderList, (orderItem) => {
              return orderItem.id == changeItem.id;
            });
            this.orderList[index] = changeItem;

            this.setRow(index, changeItem);
          });
          // this.$refs.grid1.invoke("refreshLayout");
        }
      });
    },
    valueChange(event) {
      var changeEventList = [];
      _.each(event.changes, (change) => {
        var changeEvent = {
          id: this.orderList[change.rowKey].id,
        };
        changeEvent[change.columnName] = change.value;

        changeEventList.push(changeEvent);
      });

      this.$axios
        .post("/admin/order/update", changeEventList)
        .then((result) => {
          if (result.data.res) {
            //변경된데이터 처리하기
            _.each(result.data.changedList, (changeItem) => {
              var index = _.findIndex(this.orderList, (orderItem) => {
                return orderItem.id == changeItem.id;
              });
              this.orderList[index] = changeItem;

              this.setRow(index, changeItem);
            });
            // this.$refs.grid1.invoke("refreshLayout");
          }
        });
    },
    changeFile(file) {
      var formData = new FormData();
      formData.append("file", file);
      this.$axios.post("/admin/order/upload", formData).then((result) => {
        if (result.data.res) {
          this.getOrderList();
        }
      });
    },
    changeFilter() {
      this.getOrderList();
    },
    // selectHistory() {
    //   var checkBoxList = this.$refs.grid1.invoke("getCheckedRows");

    //   var checkList = _.map(checkBoxList, (item) => {
    //     return {
    //       id: item.id,
    //     };
    //   });

    //   if (checkBoxList == 0) {
    //     window.alert("조회할 주문을 선택해주세요");
    //   } else {
    //     this.$axios.post("/admin/order/history", checkList).then((result) => {
    //       if (result.data.res) {
    //         this.history = true;
    //         Vue.nextTick(() => {
    //           this.historyDataList = result.data.checkedList;

    //           this.$refs.grid2.invoke("resetData", this.historyDataList);
    //           this.$refs.grid2.invoke("refreshLayout");
    //           this.$refs.grid1.invoke("resetData", this.orderList);
    //         });
    //       }
    //     });
    //   }
    // },
    cancleSelect() {
      var checkBoxList = this.$refs.grid1.invoke("getCheckedRows");
      this.$axios.post("/admin/order/update", checkBoxList).then((result) => {
        if (result.data.res) {
          this.$refs.grid1.invoke("resetData", this.orderList);
        }
      });
    },
    setRow(index, changeItem) {
      this.$refs.grid1.invoke("setRow", index, this.orderList[index]);
      if (changeItem.status == "1000") {
        this.$refs.grid1.invoke("addRowClassName", index, "grey");
      }
      if (changeItem.status == "100") {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "status",
          "red lighten-3"
        );
      }
      if (changeItem.status == "200") {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "status",
          "deep-orange lighten-3"
        );
      }
      if (changeItem.status == "300") {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "status",
          "yellow lighten-3"
        );
      }
      if (changeItem.status == "400") {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "status",
          "lime lighten-3"
        );
      }
      if (changeItem.status == "500") {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "status",
          "green lighten-3"
        );
      }
      if (changeItem.status == "600") {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "status",
          "cyan lighten-3"
        );
      }
      if (changeItem.status == "700") {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "status",
          "blue lighten-3"
        );
      }
      if (changeItem.status == "800") {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "status",
          "indigo lighten-3"
        );
      }
      if (changeItem.status == "900") {
        this.$refs.grid1.invoke("addCellClassName", index, "status", "red");
      }
      if (changeItem.status == "1100") {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "status",
          "pink lighten-3"
        );
      }
      if (changeItem.status == "1200") {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "status",
          "purple lighten-3"
        );
      }
      if (changeItem.status == "1300") {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "status",
          "deep-purple lighten-2"
        );
      }
      if (changeItem.status == "1400") {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "status",
          "brown lighten-3"
        );
      }
      if (moment(changeItem.deliveryExpireDate).diff(moment(), "days") == 2) {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "deliveryExpireDate",
          "red lighten-2"
        );
      }
      if (!changeItem.orderMemo) {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "orderMemo",
          "white"
        );
      } else {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "orderMemo",
          "yellow"
        );
      }
      if (!changeItem.deleveryMemo) {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "deleveryMemo",
          "white"
        );
      } else {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "deleveryMemo",
          "yellow"
        );
      }
      if (changeItem.orderNumber > 1) {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "orderNumber",
          "red lighten-2"
        );
      }
      if (
        changeItem.deliveryType &&
        changeItem.deliveryType.indexOf("佐") != -1
      ) {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "deliveryType",
          "pink lighten-3"
        );
      }
      if (
        changeItem.deliveryType &&
        changeItem.deliveryType.indexOf("郵") != -1
      ) {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "deliveryType",
          "teal lighten-3"
        );
      }
      if (changeItem.isColorSizeChange == true) {
        // console.log(changeItem.isColorSizeChange);
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "colorSize",
          "yellow"
        );
      }
      if (changeItem.isOrderNumberChange == true) {
        this.$refs.grid1.invoke(
          "addCellClassName",
          index,
          "orderNumber",
          "yellow"
        );
      }
    },
    changeStatus() {
      var checkBoxList = this.$refs.grid1.invoke("getCheckedRows");

      var changList = _.map(checkBoxList, (item) => {
        return {
          id: item.id,
          status: this.changeType,
        };
      });

      this.$axios.post("/admin/order/update", changList).then((result) => {
        if (result.data.res) {
          //변경된데이터 처리하기
          _.each(result.data.changedList, (changeItem) => {
            var index = _.findIndex(this.orderList, (orderItem) => {
              return orderItem.id == changeItem.id;
            });
            this.orderList[index] = changeItem;

            this.setRow(index, changeItem);
          });
          this.$refs.grid1.invoke("refreshLayout");
        }
      });
    },
    download() {},
    // getShopList() {
    //   this.$axios.post("/admin/shop/list").then((result) => {
    //     if (result.data.res) {
    //       var feildName = _.find(this.columns, (item) => {
    //         return item.name == "partnerShop";
    //       });
    //       var index = _.indexOf(this.columns, feildName);

    //       this.shopList = _.map(result.data.list, (item) => {
    //         return {
    //           text: item.market,
    //           value: item.marketUrl,
    //         };
    //       });
    //       this.columns[index].editor.options.listItems = this.shopList;
    //       this.shopUrlList = true;

    //       Vue.nextTick(() => {
    //         this.getOrderList();
    //         this.getHistoryDataList();
    //       });
    //     }
    //   });
    // },
    // getHistoryDataList() {
    //   this.$axios.post("/admin/order/list").then((result) => {
    //     if (result.data.res) {
    //       this.historyDataList = result.data.historyDataList;
    //     }
    //   });
    // },
    getOrderList() {
      this.$axios.post("/admin/order/list", this.filter).then((result) => {
        if (result.data.res) {
          if (this.filter.startDate == null) {
            this.orderList == null;
          } else {
            this.orderList = result.data.orderList;
          }
          this.$refs.grid1.invoke("resetData", this.orderList);
          _.each(this.orderList, (item, rowKey) => {
            this.setRow(rowKey, item);
          });
          this.$refs.grid1.invoke("refreshLayout");
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.filter,
.background {
  background: #efefef;
  border-radius: 10px;
  padding: 10px;
}
.selectBox {
  width: 200px;
}
</style>