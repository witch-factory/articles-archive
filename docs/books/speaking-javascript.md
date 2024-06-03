---
id: speaking-javascript
title: 자바스크립트를 말하다
tags: [javascript]
description: 악셀 라우슈마이어의 책 "자바스크립트를 말하다"
---

# 자바스크립트를 말하다

악셀 라우슈마이어의 "자바스크립트를 말하다"를 읽으며 메모하는 페이지

## undefined와 null

자바스크립트에서 정보가 없음을 나타내는 값은 `undefined`와 `null`이 있다.

undefined는 값이 없음을 나타내고 초기화되지 않은 변수나 생략된 매개변수의 값이다. 존재하지 않는 객체 프로퍼티를 읽으려고 할 때도 undefined가 반환된다.

null은 객체가 아니라는 뜻으로 사용된다. 객체가 올 자리에 null을 사용하면 객체가 없음을 나타낸다.

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

각 `result[i]`에서 반환되는 함수는 함수를 생성했을 당시 i값이 아니라 외부 변수 i를 참조한다. result는 이런 느낌의 내용이 되고, 루프가 끝난 시점에 외부변수 i는 5가 된다. 그래서 result[0]()을 호출하면 5가 반환된다.

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