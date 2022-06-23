//这里区分不同系统
const ua = typeof window === 'object' ? window.navigator.userAgent : '';

let _isIOS     = -1;
let _isAndroid = -1;

function isIOS() {
  if (_isIOS === -1) {
    _isIOS = /iPhone|iPod|iPad/i.test(ua) ? 1 : 0;
  }
  return _isIOS === 1;
}

function isAndroid() {
  if (_isAndroid === -1) {
    _isAndroid = /Android/i.test(ua) ? 1 : 0;
  }
  return _isAndroid === 1;
}
