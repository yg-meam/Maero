

importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
console.log(location.href)
var messaging

if (location.href.indexOf("localhost") > -1) {
    firebase.initializeApp({
        apiKey: "AIzaSyDKPAhhbkHX6c2_xvpO-1NgpW7mIgpjh7E",
        authDomain: "moneypasta-8f65b.firebaseapp.com",
        projectId: "moneypasta-8f65b",
        storageBucket: "moneypasta-8f65b.appspot.com",
        messagingSenderId: "133753858822",
        appId: "1:133753858822:web:28853c8b41b947b0980c87"
    });
    messaging = firebase.messaging();
}
else {
    firebase.initializeApp({
        apiKey: "AIzaSyAjN0szh1EXf5toP1uqgNPVuaC6IOYeNOo",
        authDomain: "moneypasta-2a68a.firebaseapp.com",
        projectId: "moneypasta-2a68a",
        storageBucket: "moneypasta-2a68a.appspot.com",
        messagingSenderId: "831379024909",
        appId: "1:831379024909:web:0126151096dc9e816f7944",
        measurementId: "G-6G9GCRCPF1"
    });
    messaging = firebase.messaging();
}


messaging.onBackgroundMessage((payload) => {
    var link
    if (payload.data.id) {
        link = location.protocol + "//" + location.host + "/admin/item/" + payload.data.id
    }
    // console.log("background!!!")
    // console.log(link)
    // console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: location.protocol + "//" + location.host + '/img/logo.png',
        data: link
    };
    // console.log(self.registration.showNotification, notificationTitle, notificationOptions)
    self.registration.showNotification(notificationTitle,
        notificationOptions);
    // console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // // Customize notification here
    // const notificationTitle = 'Background Message Title';
    // const notificationOptions = {
    //     body: 'Background Message body.',
    //     icon: '/img/doongzi.png'
    // };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});

self.addEventListener('notificationclick', function (event) {  //Notification을 클릭할 떄 이벤트를 정의합니다.
    event.notification.close();  // Notification을 닫습니다.
    event.waitUntil(clients.matchAll({  //같은 주소의 페이지가 열려있는 경우 focus
        type: 'window'
    }).then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url === '/' && 'focus' in client) {
                return client.focus();
            }
        }
        if (clients.openWindow) { //같은 주소가 아닌 경우 새창으로 
            if (event.notification.data) {
                return clients.openWindow(event.notification.data);
            }
        }
    }));
});