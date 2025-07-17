// PaystackInline.js
import React from "react";
import { WebView } from "react-native-webview";

const PaystackInline = ({ email, amount, name, onSuccess, onClose }) => {
  const htmlContent = `
    <html>
      <head><script src="https://js.paystack.co/v1/inline.js"></script></head>
      <body onload="payWithPaystack()">
        <script>
          function payWithPaystack() {
            var handler = PaystackPop.setup({
              key: 'pk_test_6dbb10e57606b65e31e7be9d5ab4e13b3e5f74e1',
              email: '${email}',
              amount: ${amount * 100},
              currency: "NGN",
              name: '${name}',
              callback: function(response) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'success', reference: response.reference }));
              },
              onClose: function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'cancelled' }));
              }
            });
            handler.openIframe();
          }
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html: htmlContent }}
      onMessage={(event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.status === "success") {
          onSuccess(data.reference);
        } else {
          onClose();
        }
      }}
    />
  );
};

export default PaystackInline;
