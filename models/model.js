var Password = require("password-encrypt-util")
const { DataTypes } = require("sequelize")
global.password = new Password("!maero!@")

/**
 * BUYMA, QOO10, RAKUTEN 세곳에서 주문한 주문정보를 저장하는테이블
 */
global.Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    comment: `
      100:발주전
      200:발주대기
      300:발주완료
      400:수령완료
      500:검품완료
      600:포장완료
      700:발송완료
      800:불량처리
      900:품절
      1000:취소
      1100:일부수령
      1200:브랜드문의
      1300:손님문의
      1400:클레임
    `
  },
  //주문알람
  orderNotice: {
    type: DataTypes.INTEGER,
  },
  //주문처 구분
  orderType: {
    type: DataTypes.INTEGER,
    comment: `
    1: BUYMA
    2: QOO10
    3: RAKUTEN
    `
  },
  //상품ID
  productId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  //상품명
  productName: {
    type: DataTypes.STRING,
  },
  //주문가격
  orderPrice: {
    type: DataTypes.INTEGER,
  },
  //주문수량
  orderNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  isOrderNumberChange: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  //거래ID
  tradeId: {
    type: DataTypes.STRING,
  },
  //구매자ID
  buyerId: {
    type: DataTypes.STRING,
  },
  //구매자 이름
  buyerName: {
    type: DataTypes.STRING,
  },
  isBuyerNameChange: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  //구매자 영문이름
  buyerEngName: {
    type: DataTypes.STRING,
  },
  //구매자 연락처
  buyerPhone: {
    type: DataTypes.STRING,
  },
  isBuyerPhoneChange: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  //구매자 우편번호
  zipcode: {
    type: DataTypes.STRING,
  },
  isZipcodeChange: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  //구매자 주소
  address: {
    type: DataTypes.STRING,
  },
  isAddressChange: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  //구매자 영문주소
  engAddress: {
    type: DataTypes.STRING,
  },
  //색/사이즈
  colorSize: {
    type: DataTypes.STRING,
  },
  isColorSizeChange: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  //배송방법
  deliveryType: {
    type: DataTypes.STRING,
  },
  hscode: {
    type: DataTypes.STRING,
  },

  //브랜드메모
  brandMemo: {
    type: DataTypes.TEXT,
  },

  // memo: {
  //   type: DataTypes.TEXT,
  // },

  //발주메모
  orderMemo: {
    type: DataTypes.TEXT,
  },

  //주문일자
  orderDate: {
    type: DataTypes.DATE,

  },
  //발송기한 주문일자로부터 18일뒤
  deliveryExpireDate: {
    type: DataTypes.DATEONLY,
  },
  //발송일
  deleveryStartDate: {
    type: DataTypes.DATE,
  },
  //발송메모
  deleveryMemo: {
    type: DataTypes.TEXT,
  },

  //매입처
  partnerShop: {
    type: DataTypes.STRING,
  },
  //매입가
  partnerPrice: {
    type: DataTypes.INTEGER,
  },
  //주문번호(매입)
  partnerOrderNo: {
    type: DataTypes.STRING,
  },
  //매입일
  partnerOrderDate: {
    type: DataTypes.DATE,
  },
  //포장번호
  number: {
    type: DataTypes.STRING,
  },
  //총중량
  packageSum: {
    type: DataTypes.INTEGER,
  },

  //주문내역 업로드순서
  createDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
})



global.User = sequelize.define("User", {
  //접속한 사용자 이메일
  email: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },

  //접속한 사용자 이름
  name: {
    type: DataTypes.STRING,
  },

  //접속한 사용자 비밀번호
  password: {
    type: DataTypes.STRING,
    //패스워드는 암호화되서 저장되도록하기
    set(val) {
      this.setDataValue('password', password.getHashPassword(val));
    }
  },
  //가입한 날짜시간
  signdate: {
    type: DataTypes.DATE,
    //defaultValue: DataTypes.NOW
  },
  //접속한 시간
  connecttime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  //권한
  authority: {
    type: DataTypes.INTEGER,
  }
})


/**
 * 사용자의 작업기록 저장(히스토리)
 */
global.ChangeLog = sequelize.define('ChangeLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  orderKey: {
    type: DataTypes.STRING,
  },
  changeField: {
    type: DataTypes.STRING,
  },
  prevValue: {
    type: DataTypes.STRING,
  },
  changeValue: {
    type: DataTypes.STRING,
  },
  createDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
})



global.Package = sequelize.define("Package", {
  //상자번호
  no: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    // comment: `
    // 60: 60
    // 70: 70
    // 90: 90
    // 100: 100
    // 130: 130
    // 150: 150
    // 180: 180
    // 200: 200
    // `
  },
  //상자의 가로
  horizontal: {
    type: DataTypes.DOUBLE,
  },
  //상자의 세로
  vertical: {
    type: DataTypes.DOUBLE,
  },
  //상자의 높이
  height: {
    type: DataTypes.DOUBLE,
  }
})

global.Shop = sequelize.define("Shop", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  //매입처
  market: {
    type: DataTypes.STRING,
  },
  //URL
  marketUrl: {
    type: DataTypes.STRING,
  }
})

global.Hscode = sequelize.define("Hscode", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  //HSCODE
  hscode: {
    type: DataTypes.STRING,
  },
  //구분
  category: {
    type: DataTypes.STRING,
  },
  //종류
  kind: {
    type: DataTypes.STRING,
  },
  //상품명
  product: {
    type: DataTypes.STRING,
  },
  //원산지
  origin: {
    type: DataTypes.STRING,
  },
})

global.ProductHscode = sequelize.define("ProductHscode", {
  // productId: { type: DataTypes.STRING, primaryKey: true },
  // hscode: { type: DataTypes.STRING, primaryKey: true }
})


Order.belongsTo(Package, {
  as: "package",
  foreignKey: "PackageId",
  constraints: false
})
Order.belongsToMany(Hscode, {
  as: "hscodes",
  through: ProductHscode,
  sourceKey: "productId",
  targetKey: "id",
  constraints: false
})

Order.belongsTo(Shop, {
  as: "shop",
  foreignKey: "ShopId",
  constraints: false
})

ChangeLog.belongsTo(User, {
  as: "user",
  foreignKey: "UserId",
  constraints: false
})
ChangeLog.belongsTo(Order, {
  as: "order",
  foreignKey: "OrderId",
  constraints: false
})