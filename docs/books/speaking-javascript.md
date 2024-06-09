---
slug: speaking-javascript
title: 자바스크립트를 말하다
description: 악셀 라우슈마이어의 책 "자바스크립트를 말하다"
---

# 자바스크립트를 말하다

악셀 라우슈마이어의 "자바스크립트를 말하다"를 읽으며 메모하는 페이지. 아는 부분은 빠르게 넘어가고 새로이 알게 된 부분을 정리

## undefined와 null(8장 내용도 추가)

자바스크립트에서 정보가 없음을 나타내는 값은 `undefined`와 `null`이 있다. 둘 다 falsy이며 프로퍼티에 접근하려 하면 어떤 형태로든 에러가 일어난다.

```javascript
function returnFoo(x){
  return x.foo;
}

returnFoo(undefined); // TypeError: Cannot read property 'foo' of undefined
returnFoo(null); // TypeError: Cannot read property 'foo' of null
```

undefined는 값이 없음을 나타내고 초기화되지 않은 변수나 생략된 매개변수의 값, 명시적으로 반환하지 않은 함수가 반환하는 값이다. 존재하지 않는 객체 프로퍼티를 읽으려고 할 때도 undefined가 반환된다.

null은 객체가 올 자리지만 비어 있음을 나타낸다. 예를 들어 프로토타입 체인의 끝을 나타내는 null이 있다. 혹은 `exec` 메서드가 일치하는 것이 없을 때 null을 반환한다.

```javascript
console.log(Object.getPrototypeOf(Object.prototype)); // null
console.log(/a/.exec('b')); // null
```

### 역사

JS는 자바에서 값을 원시값, 객체로 나누는 접근법을 빌려왔다. 또한 자바에서 "객체가 아님"을 나타내는 null을 가져왔다. 이때 C언어의 선례에 따라 null은 숫자로 변환시 0이 되었다.

```js
Number(null); // 0
```

하지만 js 첫 버전에는 예외 처리 등이 없었다. 따라서 초기화되지 않은 변수나 객체에 없는 프로퍼티 조회 등의 결과값을 '값'을 통해 알아내야 했다. 이러한 값으로 null을 쓸 수도 있었겠지만 2가지 문제가 있었다.

- 이 값은 일반적인 객체 이상의 의미가 있으므로 객체 참조의 뉘앙스가 있으면 안된다.
- 숫자값이 0이면 에러를 찾기 어려우므로 숫자값은 0이 아닌 다른 값이 좋다.

그래서 undefined가 만들어졌다. 이는 null과 다르게 객체 참조가 아닌 값이다. 또한 숫자로 변환하면 NaN이 된다.



## arguments

함수 매개변수는 모두 유사 배열 객체 arguments에 담긴다. 이는 length 프로퍼티를 가지며 배열처럼 인덱스로 접근할 수 있다. 하지만 배열 메서드는 하나도 없다.

length는 있으므로 특정한 매개변수 숫자를 강제하고 싶으면 `arguments.length`를 사용할 수 있다.

```javascript
function pair(x, y) {
  if (arguments.length !== 2) {
    throw new Error('함수 pair는 두 개의 매개변수를 필요로 합니다.');
  }
  return [x, y];
}
```

만약 arguments를 배열로 바꾸고 싶다면 `Array.prototype.slice.call(arguments)`를 사용하면 된다. slice 메서드를 빌려 와서 this를 arguments로 하여 호출하는 것이다.

## 엄격 모드

```javascript
'use strict';
```

엄격 모드에서는 변수를 사용 전에 var로 선언해야 한다.

## 함수 스코프

var 기준으로 변수 스코프는 블록이 아니라 함수이다.

```javascript
function foo(){
  var x = 1;
  if(true){
    var y = 2;
  }
  console.log(y); // if 블록 밖에서도 y에 접근 가능. 함수 스코프라서 그렇다
}
```

함수 스코프와 호이스팅이 합쳐지면 이런 동작이 된다. if문 안의 동작은 절대 실행되지 않지면 if문 안의 변수 선언은 함수의 시작 부분으로 끌어올려지기 때문에 if문 밖에서도 접근할 수 있는 것이다. 다만 값의 할당은 이루어지지 않아서 undefined가 출력된다.

```javascript
function foo(){
  console.log(x); // undefined
  if(false){
    var x = 1;
  }
}
```

새 변수 스코프가 필요하면 IIFE를 사용한다.

```javascript
(function(){
  var x = 1;
  console.log(x);
})();
```

## 함수 스코프, 클로저, IIFE

클로저는 자신의 스코프에 들어 있던 변수와 연결된다. 이는 함수가 끝나도 변수가 사라지지 않는다는 것을 의미한다. 이게 함수 스코프랑 합쳐져서 이런 결과를 낳기도 한다.

```javascript
var result = [];
for(var i = 0; i < 5; i++){
  result[i] = function(){
    return i;
  };
}

console.log(result[0]()); // 5
```

각 `result[i]`에서 반환되는 함수는 함수를 생성했을 당시 i값이 아니라 외부 변수 i를 참조한다. result는 이런 느낌의 내용이 되고, 루프가 끝난 시점에 외부변수 i는 5가 된다. 그래서 `result[0]()`을 호출하면 5가 반환된다.

```javascript
result = [
  function(){ return i; },
  function(){ return i; },
  function(){ return i; },
  function(){ return i; },
  function(){ return i; }
];
```

그래서 i가 5가 되어서 모든 `result[i]`에서 5가 반환된다. 이를 해결하기 위해 IIFE를 사용할 수 있다.

```javascript
var result = [];
for(var i = 0; i < 5; i++){
  result[i] = (function(){
    var j = i;
    return function(){
      return j;
    };
  })();
}

console.log(result[0]()); // 0
```

## 메서드 내부의 함수

모든 함수에는 특별한 변수인 this가 존재하며 함수를 호출한 객체와 런타임에 바인딩된다. 그런데 메서드 내부의 함수는 메서드의 this에 접근할 수 없다.

```javascript
var jane = {
  name: 'Jane',
  friends: ['Tarzan', 'Cheeta'],
  logHiToFriends: function(){
    'use strict';
    this.friends.forEach(function(friend){
      console.log(this.name + ' says hi to ' + friend);
    });
  }
};

jane.logHiToFriends(); // cannot read property 'name' of undefined
```

이는 먼저 this를 다른 변수에 저장하고 그 변수를 사용하면 해결된다.

```javascript
var jane = {
  name: 'Jane',
  friends: ['Tarzan', 'Cheeta'],
  logHiToFriends: function(){
    'use strict';
    var that = this;
    this.friends.forEach(function(friend){
      console.log(that.name + ' says hi to ' + friend);
    });
  }
};

jane.logHiToFriends(); // Jane says hi to Tarzan, Jane says hi to Cheeta
```

또 forEach는 2번째 매개변수로 this로 쓸 값을 받기 때문에 이를 사용할 수도 있다.

```javascript
var jane = {
  name: 'Jane',
  friends: ['Tarzan', 'Cheeta'],
  logHiToFriends: function(){
    'use strict';
    // 2번째 매개변수 사용
    this.friends.forEach(function(friend){
      console.log(this.name + ' says hi to ' + friend);
    }, this);
  }
};

jane.logHiToFriends(); // Jane says hi to Tarzan, Jane says hi to Cheeta
```

## 정규 표현식

정규 표현식은 문자열을 검색하거나 변환하는 데 사용된다. 정규 표현식은 문자열을 나타내는 패턴이다. `/`로 시작해서 `/`로 끝나는데, 이 안에 패턴을 넣는다.

```javascript
// test 메서드는 일치하는 것이 있는지 확인한다
/^a+b+$/.test('aaab'); // true
// exec 메서드는 일치하는 그룹을 캡처해 반환한다
/a(b+)a/.exec('abba'); // ['abba', 'bb']
```

`replace` 메서드의 첫 매개변수에 `/g` 플래그가 들어간 정규 표현식을 넣으면 모든 일치하는 것을 바꿀 수 있다.

```javascript
'abba'.replace(/a/g, 'x'); // 'xbbx'
```

## JS의 우아한 부분

브랜든 아이크가 가장 좋아한다고 한 부분은 다음과 같다. https://brendaneich.com/2010/07/a-brief-history-of-javascript/

- 일급 객체 함수
- 클로저
- 프로토타입
- 객체 리터럴
- 배열 리터럴

## JS 창조 이후

Javascript의 등장 이후 마이크로소프트는 1996년 8월 IE 3.0의 JScript라는 이름으로 비슷한 언어를 구현해서 넣었다. 마이크로소프트를 견제하려는 의도와 개발자들의 요구를 수용하여 넷스케이프는 Javascript를 표준화하기로 하고 ECMA 인터내셔널에 표준화를 요청했다. 그렇게 1996년 11월 ECMA-262 명세가 시작되었다.

썬에서 Java 상표를 소유하고 있었기 때문에 표준 언어의 공식 이름은 임시로 ECMAScript로 정해졌다. 이 이름은 지금도 유지되고 있지만 표준 버전을 가리킬 때만 쓰이고 모든 사람이 여전히 언어를 Javascript라고 부른다.

이후 TC39에서는 다음과 같은 표준들을 만들었다.

- ES1(1997.6)

초판

- ES2(1998.8)

ECMA-262를 ISO/IEC 16262 표준과 맞추는 작업

- ES3(1999.12)

do while, 정규 표현식, concat, replace 등 새로운 문자열 메서드, 예외 처리 등등의 도입

- ES4(폐기)

ML로 작성된 JS의 새로운 프로토타입이었지만 수용되지 않았다. 2008년 7월 말에 이런 결론이 났따.

ES3을 점진적으로 업데이트한다. 그리고 ES4보다는 덜 급진적이지만 ES3을 개선한 새 버전을 만든다. 하위 호환성을 유지하면서 조화롭게 진화시키는 것을 목표로 코드네임을 Harmony로 한다. 패키지, 네임스페이스 등 ES4의 일부 기능을 뺀다. 

- ES5(2009.12)

엄격 모드 추가, getter, setter, 새 배열 메서드, JSON 지원 등

- ES5.1(2011.6)

ECMA-262를 ISO/IEC 16262:2011 표준과 맞추는 작업

- ES6(2015.6)

let, const, 화살표 함수, 클래스, 모듈, 프라미스 등 많은 기능 도입

이런 명세들은 test262를 통해 체크되는 매우 견고한 명세이다.

## JS 관련 인기 프로젝트

- 다이나믹 HTML(1997)

DOM을 조작해서 웹 페이지를 동적으로 바꾸는 기술. IE4, Netscape 4에서 처음 등장했다.

- XMLHttpRequest(1999)

클라이언트에서 HTTP/HTTPS 요청을 서버에 보내고 피드백 데이터를 텍스트 형식으로 받는 API. IE5에서 도입되었다.

- JSON(2001)

2001년 더글러스 크록포드가 데이터를 텍스트 형식으로 저장하기 위해 개발한 데이터 구조. 자바스크립트 객체 리터럴과 유사하다.

- AJAX(2005)

웹 페이지의 응답성과 조작성을 데스크톱 애플리케이션 수준으로 끌어올리는 기술. XMLHttpRequest를 사용한다. 2005년 2월 구글 맵스가 사용하면서 유명해졌다.

구글 맵스에서는 지도를 확대/축소하며 볼 수 있지만 현재 보이는 콘텐츠만 브라우저가 내려받도록 했다. 이는 콘텐츠를 백그라운드에서 XMLHttpRequest로 불러오고 결과를 현재 페이지에 다이나믹 HTML을 통해 업데이트하는 방식이다. 한번 서버 요청을 보낼 때마다 페이지 전체를 리로드하는 것이 아니라 필요한 부분만 업데이트하는 방식이고 따라서 속도가 매우 빨라졌다.

기반 기술은 몇 년 전부터 있었지만 AJAX로 인해 JSON이 인기를 얻었고 소켓 등 다른 프로토콜이 쓰이기 시작했으며 양방향 통신이 가능해졌다. 요즘은 너무 당연해진 기술이다.

- CouchDB(2005)

여러 NoSQL 데이터베이스 중 하나로 JSON 형식 DB라고 할 수 있다. 스키마 대신 JSON 객체를 받는다.

- jQuery(2006)

추상화된 DOM 조작 API를 통해 브라우저별 DOM 조작의 차이점을 해결하고 쉽게 DOM을 조작할 수 있게 해주는 라이브러리. 2006년 존 레식이 처음 만들었다.

- 웹킷(2007)

2003년 애플은 KDE에 기초해 웹킷 HTML 엔진을 만들었고 2005년 오픈소스로 공개했다. 2007년 아이폰이 출시되면서 모바일 웹은 주류로 떠올랐다.

- V8(2008)

구글이 크롬을 위해 만든 자바스크립트 엔진. 매우 빠른 속도로 자바스크립트를 실행했고 JS가 느리다는 인식을 뒤집으며 성능 경쟁을 시작했다.

- Node.js(2009)

라이언 달이 만든 서버 사이드 자바스크립트 런타임. 브라우저에서만 돌아가던 자바스크립트를 서버에서도 돌릴 수 있게 해준다. 이벤트 기반 비동기 IO와 V8을 쓴다.

클라이언트와 서버에서 같은 언어를 쓰게 해줌으로써 코드를 더 많이 공유할 수 있고 isomorphic JS 테크닉을 쓸 수 있다. 이는 서버에서도 클라이언트에서도 돌아가는 코드를 만드는 것이다. 페이지를 서버에서 렌더링하기도 하고 클라이언트에서 렌더링하기도 한다.

- 폰갭(2009)

HTML5로 네이티브 모바일 애플리케이션을 만드는 게 목적이었는데 이제는 모바일이 아니라 운영체제도 지원한다. 즉 기기 애플리케이션을 만들 때 웹 기술을 사용할 수 있다. 가속도계, 카메라 등 네이티브 기능에 접근하는 API도 전용으로 있다.

- 크롬OS(2009)

브라우저를 운영체제로 만들었다. 브라우저가 모든 것을 처리하고 웹 애플리케이션을 실행한다. 즉 웹 개발자가 네이티브 애플리케이션을 만들 수 있게 된다.

- 윈도우 8(2011)

MS는 윈도우 8 운영체제를 HTML5와 통합했다. 윈8은 HTML5로 만든 애플리케이션을 .NET이나 C++로 만든 애플리케이션과 동일한 방식으로 실행할 수 있다. 실제로 앱스토어, 이메일 등 여러 중요한 애플리케이션을 HTML5에서 네이티브 API를 호출하는 형태로 만들어 가능성을 증명했다.

## 표현식과 문

표현식은 값을 생성하고 값이 있어야 할 곳, 함수의 매개변수나 할당문의 오른쪽 등에 쓸 수 있다.

문은 어떤 동작을 하는 것을 의미한다. 반복문, 조건문 등이다. 프로그램은 기본적으로 문의 연속이다. 문을 쓸 수 있는 곳에는 표현식을 쓸 수 있다. 반면 표현식을 써야 할 곳에 문을 쓰지 못하는 경우는 있다. if문이 함수 매개변수로 들어갈 순 없는 것이다.

### 모호한 표현식

문처럼 생긴 표현식도 있다. 가령 객체 리터럴과 블록은 둘 다 중괄호에 싸여 있다. 다음 코드는 객체 리터럴일 수도 있고 `foo` 레이블 다음에 오는 함수 호출을 포함하는 블록일 수도 있다.

```js
{
  foo:func(1,2);
}
```

그리고 함수 표현식에 이름이 붙으면 함수 선언처럼 보일 수 있다. 단 JS는 보통 객체 리터럴과 함수 표현식을 문처럼 쓰는 걸 막기 위해 문을 중괄호 혹은 `function` 키워드로 시작하지 못하게 한다.

이런 요건을 만족하기 위해서 여러 방법을 쓸 수 있는데 대표적으로 괄호로 표현식을 감싸는 게 있다. `eval`이 객체를 반환하게 하거나 IIFE를 쓸 때 그렇다.

```js
eval('({foo:1})'); // {foo:1} 객체를 반환하게 하려면 괄호로 감싸야 한다

(function(){
  return 'a';
})(); // IIFE를 쓸 때도 함수 표현식을 괄호로 감싸야 한다. 그러지 않으면 익명 함수 선언으로 인식되어 에러가 발생한다.
```

## 세미콜론 자동 삽입

세미콜론 자동 삽입이라는 말은 마치 파서가 자동으로 세미콜론을 삽입해준다는 것처럼 들린다. 하지만 이는 파서가 문이 끝나는 지점을 판단하는 데에 쓰이는 것에 가깝다. 기본적으로 문은 세미콜론으로 끝나지만 세미콜론이 없어도 문이 끝나는 지점을 파서가 판단할 수 있다는 것이다.

## 숫자 리터럴 메서드 호출

메서드 호출시 부동소수점 기호인 점과 점 연산자를 구별해야 한다. `1.toString()`은 불가능하고 반드시 다음처럼 써야 한다.

```js
1..toString(); // '1'
1 .toString(); // '1'
(1).toString(); // '1'
1.0.toString(); // '1'
```

## 엄격 모드

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Strict_mode

```js
'use strict';
```

- 변수를 반드시 선언해야 한다.

엄격모드에선 모든 변수를 명시적으로 선언해야 한다. 선언하지 않은 변수를 사용하면 에러가 발생한다.

참고로 엄격 모드가 아닌 JS는 선언하지 않은 변수를 사용하면 암묵적으로 전역 변수로 선언했다. 이는 실수를 유발하기 쉽다.

- arguments 객체

arguments 객체의 caller, callee는 폐기됐고 변수명으로 arguments를 사용할 수 없다. 또한 arguments 객체는 이제 매개변수와 동기화되지 않는다(매개변수가 바뀌어도 arguments가 바뀌지 않는다는 뜻).

- this

원래 JS에서 메서드가 아닌 함수의 this는 전역 객체다. 브라우저에서는 window가 된다.

반면 엄격 모드에서는 메서드가 아닌 함수의 this가 undefined가 된다. 즉 생성자에서 this를 사용하면 undefined가 된다.

```js
function Point(x, y){
  'use strict';
  this.x = x;
  this.y = y;
}

// new 없이 생성자를 함수로 호출하면 예외가 일어난다.
// strict 모드가 아니었다면 에러 대신 전역변수 x, y가 생성됐을 것이다.
Point(1, 2); // TypeError: Cannot set property 'x' of undefined
```

- 읽기 전용 프로퍼티

엄격 모드에서는 읽기 전용 프로퍼티에 값을 할당하려고 하면 에러가 발생한다. length 프로퍼티가 대표적이다. NaN도 마찬가지다.

```js
'use strict';
var arr = [1, 2, 3];
arr.length = 1; // 1

NaN = 1; // TypeError: Cannot assign to read only property 'NaN' of object '#<Window>'
```

- 전역 변수 삭제

원래는 다음과 같이 전역변수 foo를 삭제할 수 있었다.

```js
delete foo;
```

하지만 엄격 모드에서는 이를 할 수 없다. 전역 변수를 엄격 모드에서 지울 땐 이렇게 해야 한다.

```js
delete window.foo;
delete this.foo
```

- eval의 명확함

eval은 쓰면 안되기는 하지만 엄격 모드에서 좀 낫다. 엄격 모드에선 eval에 넘긴 문자열로 선언된 변수가 eval 주위 스코프에 영향을 미치지 않게 된다.

- 금지된 기능

`with`가 금지되었다. 그리고 원래는 0으로 시작하는 정수 리터럴이 8진수로 해석됐지만 엄격 모드에서는 이런 8진수 리터럴을 쓰면 에러가 발생한다.

# 8. 값

