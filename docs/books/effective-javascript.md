---
slug: effective-javascript
title: 이펙티브 자바스크립트
description: 데이비드 허먼, "이펙티브 자바스크립트"
---

# 이펙티브 자바스크립트

이펙티브 자바스크립트를 읽으며 매일 메모 남기기

## 2024.08.22

아이템 2. 부동 소수점 숫자

JS의 모든 숫자는 IEEE 754 double이다. 따라서 -2^53 ~ 2^53 사이의 정수는 정확하게 표현할 수 있다. 그 이상의 숫자는 근사값으로 표현된다.

이때 비트 연산자는 다른 연산자들과 달리 피연산자들을 부동 소수점 숫자처럼 처리하지 않는다. 대신 암묵적으로 32비트 정수로 변환하고 연산 수행 후 다시 부동 소수점 숫자로 변환하여 돌려준다. 따라서 비트 연산자를 사용할 때는 주의해야 한다.

```js
8 | 1 // 9
// 내부적으로 8과 1을 32비트 정수로 변환하여 비트 연산을 수행한 후 다시 부동 소수점 숫자로 변환하여 돌려준다.
```

아이템 3. 암묵적인 형변환에 주의하라

객체는 `toString()` 메서드를 통해 문자열로 변환되고, `valueOf` 메서드를 통해 숫자로 변환된다.

```js
const obj = {
  toString() {
    return 'hello';
  },
  valueOf() {
    return 3;
  }
};

Number(obj); // 3
String(obj); // 'hello'
```

객체를 문자열과의 더하기 맥락에서 쓰게 된다면 `toString` 메서드를 이용할 수 있다.

```js
const obj = {
  toString() {
    return 'witch';
  }
};

console.log('the ' + obj); // 'the witch'
```

그런데 객체가 `toString`, `valueOf`를 둘 다 가진다면 `+`는 문자병합과 덧셈에 모두 쓰이므로 어떤 걸 호출할지 애매해진다. JS는 일단 `valueOf`를 호출하고 그 결과에 대해 `toString`을 호출한다. 따라서 누군가 객체에 문자열 더하기를 실행하면 `valueOf` 부터 호출되어 의도하지 않은 결과가 나올 수 있다.

```js
const obj = {
  toString() {
    return 'witch';
  },
  valueOf() {
    return 3;
  }
};

console.log('the ' + obj); // 'the 3'
```

`valueOf`는 객체가 실제로 숫자로 된 값을 가질 때 사용하는 게 맞다. 이런 객체에서 `toString`, `valueOf`는 문자열 표현 또는 동일한 값을 갖는 숫자 표현을 반환한다. 즉 `valueOf` 를 갖는 객체는 해당 메서드가 생성하는 숫자값의 문자열 표현을 생성하는 `toString` 메서드를 갖는 것이 좋다.

```js
const obj = {
  valueOf() {
    return 3;
  },
  toString() {
    return '3';
  }
};
```

그런데 보통 문자 형변환이 더 일반적이므로 객체가 정말로 숫자의 추상화가 아니며 `toString`이 `valueOf`의 문자열 표현이 되는 게 의미적으로 맞지 않다면 `valueOf` 사용을 피하는 게 좋다.

아이템 5. `==`로 혼합 데이터형을 비교하지 말라

```js
const obj={
  valueOf: function() {
    return true;
  }
}
"1.0e0" == obj; // true
```

두 값은 `==`로 비교되기 전에 숫자로 암묵적으로 변환되기 때문에 이런 결과가 나온다. 따라서 혼합 데이터형을 비교할 때는 `===`를 사용하는 게 좋다. 그렇지 않으면 코드를 읽는 사람이 형변환 규칙을 알아야 하고 알더라도 혼란스러울 수 있다.

- 아이템 7. 문자열을 16비트 코드 단위 시퀀스로 간주하라

유니코드는 기본적으로 0부터 1,114,111까지의 유일한 정수 값에 세상의 모든 문자 단위를 할당한 것이다. 아스키 코드와 개념적으로는 별로 다르지 않다. 다른 점이라면 각 인덱스가 유일한 바이너리 표현에 매핑되는 아스키 코드와 달리 유니코드는 코드 포인트에 서로 다른 여러 바이너리 인코딩을 허용한다는 것이다.

원래 유니코드는 2^16개의 코드 포인트 이상이 필요하지 않을 거라고 판단했다. 그래서 표준 16비트, 즉 한 글자를 2바이트로 인코딩하는 UCS2가 등장했다. 이를 쓰면 모든 코드 포인트를 16비트로 표현할 수 있었다. 따라서 문자열의 n번째 글자에 접근하기 위해서 배열의 n번째 16비트 요소를 선택하면 되었기 때문에 인덱싱 비용이 저렴했다.

따라서 많은 플랫폼이 16비트 인코딩을 썼고 Java, Javascript도 마찬가지였다. JS의 문자열의 모든 요소는 16비트 값이다. 그런데 유니코드는 점점 확장되어 지금은 2^20개의 코드 포인트가 넘는 범위로 확장되었다. 그렇게 유니코드가 확장되자 UCS2는 구식이 되었다.

그래서 UCS2가 추가된 코드 포인트 표현을 위해 확장된 게 UTF-16이다. 대부분 비슷하지만 서로게이트 쌍이 추가되었다. 서로게이트 쌍은 16비트로 표현할 수 없는 코드 포인트를 2개의 16비트 코드 유닛으로 나누어 표현하는 방법이다. 예를 들어 `U+1D306`은 `0xD834 0xDF06`으로 표현된다. 이 코드 포인트는 두 코드 유닛 각각에 대응하는 비트를 결합해 디코딩될 수 있다.

따라서 UTF-16은 가변 길이 인코딩이다. 각 글자는 16비트 코드 유닛 1개 또는 2개(서로게이트 쌍)로 표현될 수 있다. 그래서 같은 길이 문자열도 메모리 사용량이 다를 수 있다. 예를 들어 `A`는 1개의 코드 유닛으로 표현되지만 `😀`는 2개의 코드 유닛으로 표현된다.

유니코드가 확장될 때 JS는 이미 16비트 문자열 요소들을 쓰고 있었다. 따라서 유니코드가 확장될 때 이미 문자열의 `length`,  `charAt`같은 프로퍼티, 메서드들은 모두 1글자가 아니라 16비트 코드 유닛의 단계에서 동작한다. 즉 JS 문자열은 16비트 코드 유닛의 배열이고 `length`는 정확한 글자 수가 아니라 코드 유닛의 개수를 반환한다.

비슷하게 정규 표현식도 16비트 코드 유닛 단위로 실행된다. 따라서 유니코드 전체 영역을 처리하는 애플리케이션을 만드는 것은 어렵다. 이런 문제를 해결하기 위해 ES6에서는 코드 포인트 단위로 문자열을 다룰 수 있는 메서드를 추가하긴 했다.

아무튼 유니코드 전체를 포함하는 문자열을 다뤄야 한다면 서드파티 라이브러리를 사용하는 게 좋다. 인코딩/디코딩 세부 사항을 이해하기는 어려운 일이라서...

ECMAScript 라이브러리 중 일부, `encodeURI`, `decodeURI`, `encodeURIComponent`, `decodeURIComponent`같은 URI 조작 함수들은 서로게이트 쌍을 정확히 처리한다.

## 2024.08.23

- 아이템 8. 전역 객체 사용 최소화

JS의 전역 네임스페이스는 전역 객체로도 노출되어 있다. 이는 프로그램 최상단에서 `this`로 접근 가능하다. 브라우저에서는 `window`, Node.js에서는 `global`이 전역 객체이다. 전역 변수를 추가하거나 수정하면 전역 객체에 프로퍼티가 추가되거나 수정된다.

```js
var a = 1;
console.log(window.a); // 1
window.a=2;
console.log(a); // 2
```

물론 전역 변수를 사용한다면 전역 객체를 사용하는 것보다 `var`로 선언하는 게 좋다.

전역 객체 사용은 최소화하는 게 좋다. 하지만 전역 객체는 환경을 동적으로 반영하기 때문에, 플랫폼에서 사용 가능한 기능 탐지를 위해서는 사용해야 한다.

```js
if (typeof window !== 'undefined') {
  // 브라우저 전용 코드
}

if (Array.prototype.includes === undefined) {
  // includes 메서드가 없는 환경에서만 실행되는 폴리필
}
```

- 아이템 9. 항상 지역변수를 선언하라

변수를 선언하지 않고 사용하면 JS에서는 자동으로 전역 변수로 선언된다. 스코프에 상관없이 전역 변수가 된다. 이는 의도치 않은 변수 충돌을 일으킬 수 있으므로 주의하자. 물론 이는 엄격 모드에서는 다행히 금지된다.

- 아이템 10. with를 사용하지 마라

하나의 객체에서 여러 메서드를 호출하려고 할 시 해당 객체에 대한 참조를 반복하지 않으려고 쓰는 with문

```js
function status(info){
  var widget= new Widget();
  with(widget){
    setBackground('blue'); // Widget.prototype.setBackground에서 찾음
    setForeground('white');
    setText("Status: " + info); // 이 info는 원래 함수 인수에서 오는 것으로 의도됨
    show();
  }
}
```

그러나 이러면 `with`의 프로퍼티를 통해 참조하려고 하던 변수와 외부 변수 바인딩에서 참조하길 바라는 변수를 구별할 방법이 없어 혼란이 발생할 수 있다. 일반적인 스코프 체인 탐색 과정에서 `with`의 프로퍼티와 프로토타입 체인이 끼어들어간 것 뿐이기 때문이다.

즉 프로그램의 다른 부분에서 `with`에 전달된 객체 혹은 그 객체의 프로토타입에 새로운 프로퍼티가 추가되면 `with` 블록 내부에서 의도치 않게 그 프로퍼티를 참조할 수 있다. 예를 들어 위 코드에서 widget 객체에 info 프로퍼티를 갖게 되면(혹은 `Widget.prototype`이 `info`를 갖게 되면) `setText` 메서드는 함수에서 인수로 받은 info 대신 widget의 info 프로퍼티를 사용하게 된다.

당연히 그냥 새 변수를 선언하고 사용하는 게 안전하다.

```js
function status(info){
  var widget= new Widget();
  widget.setBackground('blue');
  widget.setForeground('white');
  widget.setText(text);
  widget.show();
}
```

- 아이템 11. 클로저에 익숙해져라

함수 자신을 포함하는 스코프의 변수들을 추적하는 함수를 클로저라고 한다. 이는 함수가 종료되어도 변수가 사라지지 않게 하고, 참조를 저장하기 때문에 함수가 종료된 후에도 변수에 접근하여 변경도 할 수 있다.

- 아이템 12. 변수 호이스팅에 대해 이해하라
- 아이템 13. 지역 변수 스코프를 만들기 위해 IIFE를 사용하라

JS var는 함수 스코프다. 그러면 호이스팅은 변수 선언을 함수 스코프 최상위로 끌어올린다는 것만 기억. 그리고 같은 스코프에서 var로 변수를 재선언하는 건 호이스팅에 의해 1개의 변수 선언처럼 처리된다.

```js
function isWinner(player, others){
  var highest = 0;
  for(var i=0; i<others.length; i++){
    var player = others[i];
    if(player.score > highest){
      highest = player.score;
    }
  }
  // 함수 인수가 아니라 for문 내에서 선언된 player 변수를 사용하게 됨
  return player.score > highest;
}
```

ES3 시절에도 블록 스코프가 지원되는 예외적이었던 상황 중 하나는 exception이었다. try-catch-finally 블록 내에서 선언된 변수는 블록 스코프를 갖는다. try-catch는 exception을 잡아서 변수로 바인딩하고 해당 변수는 catch 블록 안에서만 스코프가 적용된다.

```js
function test(){
  var x="var", result=[];
  result.push(x);
  try{
    throw "exception";
  }catch(x){
    // catch 블록 내부에서 x는 catch "블록" 스코프를 갖는다.
    // 외부 x에 영향을 미치지 않음
    x="catch";
  }
  result.push(x);
  return result;
}
test(); // ["var", "var"]
```

클로저와 함수 스코프 때문에 이런 버그가 만들어진다.

```js
function wrapElements(a){
  var result=[];
  for(var i=0, n=a.length; i<n; i++){
    result[i]=function(){
      return a[i];
    };
  }
  return result;
}

var wrapped = wrapElements([10, 20, 30, 40, 50]);
var f = wrapped[0];
f(); // undefined
```

이 코드는 반복문을 순회할 때마다 `result[i]`에 새로운 함수를 만들어서 저장한다. 그런데, 우리의 의도는 `result[i]()`에 `a[i]`가 나오게 하는 거였다.

`i`, `n`은 for문 블록에 한정된 변수가 아니고 함수 스코프에 속한다. 그리고 호이스팅되어서 사실상 함수 최상단에 선언된 것이나 다름없다.

이 wrapElements 내부에서 생성되어 `result[i]`에 할당된 함수는 i의 값을 명백히 저장하고 있는 게 아니라 외부 변수 i에 대한 참조를 저장하고 있다. 따라서 `result[0]()`을 호출할 때 i는 이미 `a.length`인 5가 되어 있고 `a[5]`는 `undefined`이므로 `undefined`가 반환된다.

이렇게 클로저는 외부 변수의 값이 아니라 참조를 가리킨다. 따라서 `wrapElement`에서 생성된 함수의 모든 클로저는 호이스팅된 `i`에 대한 참조를 공유한다.

이를 해결하기 위해서는 ES6의 let, const 이전 기준으로 IIFE를 사용하여 새로운 스코프를 만들어야 한다.

```js
function wrapElements(a){
  var result=[];
  for(var i=0, n=a.length; i<n; i++){
    (function(){
      var j=i;
      result[i]=function(){
        return a[j];
      };
    })();
  }
  return result;
}

// 혹은 지역 변수를 IIFE 인수로 전달
function wrapElements(a){
  var result=[];
  for(var i=0, n=a.length; i<n; i++){
    (function(j){
      result[i]=function(){
        return a[j];
      };
    })(i);
  }
  return result;
}
```

단 이렇게 지역 스코프를 만들기 위해 IIFE를 사용할 때는 조심해야 한다. 블록 바깥으로 나가기 위한 break, continue 명령을 쓸 수 없어지고 this, arguments의 해석이 달라지기 때문이다. 3장에서 다룬다고 한다.

- 아이템 14. 기명 함수 표현식 스코프에 주의하라