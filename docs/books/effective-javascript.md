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

## 20240825

- 아이템 14. 기명 함수 표현식 스코프에 주의하라

함수 표현식은 익명 함수를 생성하는 데에 사용할 수 있다. 예를 들어 다음과 같이 말이다. 이렇게 하면 인수를 제곱해서 돌려주는 함수가 변수 `square`에 바인딩된다.

```js
var square = function(x){
  return x*x;
};
```

그런데 이런 함수 표현식에도 이름을 지정할 수 있다. 이를 기명 함수 표현식이라고 한다. 기명 함수 표현식은 함수 표현식 스코프 내에서만 유효한 이름을 갖는다. 따라서 함수 내부에서 자신을 재귀적으로 호출할 때 유용하다.

단 이렇게 함수 표현식에 지정한 이름은 함수 내부에서만 스코프가 적용된다. 함수 선언문과 달리 기명 함수 표현식은 함수 이름을 외부에서 참조할 수 없다.

```js
var f = function fact(x){
  // 이 내부에서 fact를 지역 변수로 사용할 수 있다.
  if(x<=1) return 1;
  return x*fact(x-1);
};

f(3); // 6
fact(3); // ReferenceError: fact is not defined. fact는 함수 선언의 스코프 내에서만 유효하다.
```

사실 이렇게 재귀를 위해 기명 함수 표현식을 사용하는 건 함수가 바인딩된 변수명을 사용하거나 함수 선언문을 사용하는 대체재가 있다. 또한 최신 JS 환경은 에러 추적을 위해 스택 트레이스를 할 때 함수 표현식 이름을 사용한다. 따라서 기명 함수 표현식은 디버깅에 매우 유용하다.

하지만 이전 JS 엔진에서의 버그와 명세 실수로 인해 기명 함수 표현식은 많은 버그를 만들었다. ES3 명세에서는 기명 함수 표현식 스코프를 객체로 표현하도록 했다. 이 스코프 객체는 그 함수 이름을 바인딩하는 프로퍼티 하나만 가지지만, 그 이전에 객체로서 `Object.prototype`을 상속받았다. 이는 기명 함수 표현식을 사용하면 `Object.prototype`의 프로퍼티가 기명 함수 표현식의 스코프에 노출되는 버그를 만들었다.

```js
// ES3 실행 환경에서
function constructor(){return null;}

var f = function f(){
  return constructor();
};

f(); // null이 아니라 {}가 반환된다.
```

원래 의도대로라면 `f` 내부의 `constructor`는 외부 스코프의 `constructor`를 참조해서 null을 반환해야 한다. 하지만 기명 함수 표현식 `f`는 `Object.prototype`를 상속하므로 `constructor`는 `Object.prototype.constructor`를 가리키게 된다. 따라서 `f` 내부의 `constructor`는 `Object.prototype.constructor`를 가리키게 되어 빈 객체를 반환한다.(모든 객체는 prototype.constructor으로 인스턴스의 프로토타입을 만든 `Object` 생성자의 참조를 가리킨다)

그리고 프로토타입 상속 특성상 `Object.prototype`이 변경되면 기명 함수 표현식 스코프도 동적으로 영향을 받게 된다. 또 당시 몇몇 실행 환경에서는 익명 함수 표현식의 스코프도 객체로 취급해 버리는 버그가 있었다고 한다...

ES5에서는 이 문제가 수정되었다.

이전 환경에서 이렇게 함수 표현식 스코프가 객체 프로토타입으로 오염되는 문제를 막는 최선의 방법은 `Object.prototype`에 새로운 프로퍼티를 절대 추가하지 않고 지역 변수 이름으로 `Object.prototype`의 프로퍼티명을 절대 사용하지 않는 것이다.

그리고 예전의 몇 엔진에서는 기명 함수 표현식을 선언문처럼 호이스팅하기도 했다.

```js
// 이 코드는 ES3 시절 일부 엔진의 버그를 나타낸다
var f= function g(){return 1;};
g() // 1
```

이렇게 기명 함수 표현식과 같은 이름으로 지역 변수를 만들고 null을 할당하여 해결할 수도 있다.

```js
var f = function g(){return 1;};
var g=null;
```

하지만 가독성도 떨어진다.. 기명 함수 표현식은 사용하기에는 문제가 많다. 디버깅할때만 필요시 사용하자. 실제 코드에서는 함수 표현식은 모두 익명인 게 좋다. 단 요즘은 대부분이 ES5 이상을 지원하므로 이런 문제는 거의 없을 것이다.

**ES5를 제대로 구현한 실행 환경에 배포한다면 아무런 걱정을 할 필요가 없다.(65쪽)**

- 아이템 15. 블록-지역 함수 선언문 스코프에 주의하라

다른 함수 내부의 최상단 스코프에 함수 선언문을 넣는 건 완전히 잘 작동한다.

```js
function f(){
  return "global";
}

function test(x){
  function f(){
    return "local";
  }
  var result=[];
  if(x){
    result.push(f());
  }
  result.push(f());
  return result;
}

test(true); // ["local", "local"]
```

그런데 지역 블록 안에서 함수 선언문을 쓰면?

```js
function f(){
  return "global";
}

function test(x){
  var result=[];
  if(x){
    function f(){
      return "local";
    }
    result.push(f());
  }
  result.push(f());
  return result;
}

test(true); // ES3까지는 제대로 예측할 수 없다
```

ES5 이전까지는 이런 부분에 대한 명세 기준이 없었다. 단 이는 엄격 모드에서 금지되었다.

[엄격 모드는 스크립트나 함수의 최상위 레벨이 아닌 곳에서의 함수 내용 정의를 제한한다.](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Strict_mode#%EB%AF%B8%EB%9E%98%EC%9D%98_ecmascript_%EB%B2%84%EC%A0%84%EC%9D%84_%EC%9C%84%ED%95%9C_%EC%A4%80%EB%B9%84)

함수 선언은 어쨌든 스크립트나 함수의 최상위 블록 레벨에 두는 게 문제를 막을 수 있다.

만약 정말로 함수들을 조건에 따라 선택해야 한다면 var로 함수 표현식을 사용하자. 이러면 할당만 조건부로 실행되므로 완전히 예상할 수 있는 결과를 얻을 수 있다.

```js
function f(){
  return "global";
}

function test(x){
  var result=[];
  var g = f;
  if(x){
    g = function(){
      return "local";
    };
    result.push(g());
  }
  result.push(g());
  return result;
}

test(true); // ["local", "local"]
test(false); // ["global"]
```

- 아이템 16. eval로 지역 변수를 생성하지 마라

eval은 사용하지 않는 게 좋다. 엄격 모드에선 좀 나아졌다고 하지만...

eval은 인자로 받은 문자열을 JS 프로그램처럼 해석하고 실행한다. 그런데 엄격 모드 이전의 eval은 eval이 호출된 스코프에 새로운 변수를 동적으로 추가할 수 있었다.

```js
function test(x){
  eval("var y=x;");
  return y;
}

test(10); // 10
```

이는 명확하지만 변수 선언문이 test함수 본문에 있는 것과는 동작이 약간 다르다. 이 선언은 eval이 호출될 때만 실행된다. 조건절에서 써보면 알 수 있다.

```js
function test(x){
  if(x){
    eval("var y=x;");
  }
  return y;
}

test(10); // 10
test(0); // ReferenceError: y is not defined
```

스코프를 런타임에 정하도록 하는 건 대부분 좋지 않다. 이는 소스코드를 eval에 동적으로 전달하도록 할 때 특히 더 어려워진다.

```js
// 엄격 모드 이전
var y="global";
function test(src){
  eval(src);
  return y;
}

test("var y='local';"); // "local"
test("var z='local';"); // "global"
```


엄격 모드가 아닐 때 동작하는 이런 코드는 안전하지 않다. 외부 호출자가 test 함수 내부 스코프를 변경할 수 있기 때문이다.

ES5의 엄격 모드는 eval을 감싸진 스코프에서 실행하도록 한다. 즉시 실행 함수를 사용하면 비슷하게 eval이 외부 스코프에 영향을 주지 않도록 제한할 수 있다.

그러니 엄격 모드가 아닌 상태이고 eval 코드가 전역 변수를 생성할 가능성이 있다면 함수로 감싸 실행하는 것도 좋다.

```js
var y="global";
function test(src){
  (function(){
    eval(src);
  })();
  return y;
}

test("var y='local';"); // "global"
```

- 아이템 17. 직접적인 eval보다는 간접적인 eval

eval 식별자를 직접 포함하는 건 직접적인 eval 호출이다. eval 식별자 호출은 다음과 같이 직접적인 호출로 간주된다. 이렇게 하면 eval이 실행한 프로그램은 호출자의 지역 스코프에서 평가된다. 이게 우리가 아는 일반적인 eval의 동작이다.

이렇게 직접적으로 eval을 호출하는 방법은 eval이라는 이름을 직접 사용하는 것 뿐이다.

반면 eval을 다른 변수명으로 바인딩한 후 호출하는 것같이 간접적으로 호출하면 eval이 실행한 프로그램은 호출자의 지역 스코프가 아닌 전역 스코프에서 평가된다.

```js
var x="global";
function test(){
  var x="local";
  var f = eval;
  return f("x");
}

test(); // "global"
```

이렇게 간접적인 eval을 호출하는 좋은 방법은 이렇게 숫자 리터럴과 쉼표 연산자를 사용하는 것이다.

```js
(0, eval)(source);
```

이렇게 하면 괄호로 싸인 식은 쉼표 연산자에 의해 `eval`함수를 반환하고, 이렇게 만들어진 eval을 사용하면 간접적으로 호출되어 호출된 스코프가 호출자의 스코프가 아닌 전역 스코프에서 평가된다.

직접 eval을 사용하는 건 내부 스코프를 신뢰할 수 없는 코드에게 노출시킬 수 있는 위험을 늘리고 성능을 저하시킨다. 직접적인 eval은 지역 스코프를 조사해야 하는 추가적인 능력이 확실히 필요할 경우에만 사용해야 한다. 그렇지 않을 경우 간접적 eval을 사용하자.

물론 eval은 사용하지 않는 게 좋다.

## 2024.08.26

- 아이템 18. 함수, 메서드, 생성자 호출의 차이를 이해하라

ES6 이전의 JS에서는 함수, 메서드, 생성자가 모두 function 키워드를 이용해야 했다.

메서드 호출 시 호출 표현식이 어떤 객체를 통해 호출되느냐에 따라 `this` 객체의 바인딩이 정해진다. 메서드가 정의된 객체가 아니라 메서드를 호출한 객체가 `this`가 된다.

```js
var obj = {
  hello: function(){
    return "hello " + this.username;
  },
  username: "witch"
}

var obj2={
  username: "may",
  hello: obj.hello
}

obj.hello(); // "hello witch"
obj2.hello(); // "hello may"
```

이는 여러 객체에서 공유되는 함수를 만들 때 쓸 수도 있지만 이럴 경우 프로토타입을 쓰는 게 낫다고 보이기는 한다.

```js
function hello(){
  return "hello " + this.username;
}

var obj = {
  hello: hello,
  username: "witch"
}

var obj2={
  hello: hello,
  username: "may"
}
```

그러나 이렇게 this를 사용하는 함수를 전역에서 함수로 호출하게 되면 전역 객체 프로퍼티(즉, 전역 변수)를 조회하게 되므로 일반적으로 그렇게 유용하지 않다.

사실 전역 객체로 this를 바인딩하는 건 문제의 소지가 있어서 ES5에 엄격 모드에서는 전역 함수 호출 시 this가 undefined로 바인딩된다.

```js
function hello(){
  "use strict";
  return "hello " + this.username;
}

hello(); // TypeError: Cannot read property 'username' of undefined
```

`new` 키워드와 함께 함수를 생성자로 쓰면 this 값으로 새로운 객체를 전달하고 암묵적으로 이 객체를 함수 결과로 반환한다. 생성자 함수를 이용해서 초기화된 객체를 찍어낼 수 있다.

- 아이템 19. 고차 함수에 익숙해져라

고차 함수: 다른 함수를 인자로 받거나(콜백 함수) 함수를 결과로 반환하는 함수

대표적으로 배열의 `.sort()`메서드가 있다.

또한 비슷한 형식으로 함수를 호출하는 것을 보게 되면 이를 콜백을 사용하는 고차 함수로 추상화해서 코드를 간결하게 만들 수 있다.

이렇게 고차 함수로 만들면 반복문의 경계를 지역적으로 지정하는 등 좀더 유연한 방식으로 공통 로직을 추출할 수 있다. 그리고 버그나 최적화를 할 때도 고차 함수를 한번만 수정하면 되므로 유지보수가 쉬워진다.

## 2024.08.27

- 아이템 20. call 메서드를 사용하라

this 객체를 특정 객체로 지정해서 함수를 호출할 수 있다. 이를 위해 `call` 메서드를 사용한다.

```js
// obj를 this로 하여 f를 호출하기 위해
// 물론 이렇게 임시로 메서드를 추가할 수도 있다.
obj.temp = f;
var result = obj.temp(arg1, arg2);
delete obj.temp;

// 충돌 위험 등을 피하기 위해 call을 사용하자
var result = f.call(obj, arg1, arg2); // f의 this를 obj로 지정하여 호출
```

이는 할당에 의해 덮어써지지 않은 메서드 사용을 보장해야 할 때 응용할 수 있다.

```js
// 함수 덮어쓰기
dict.hasOwnProperty = function(){
  return false;
};

// 이런 경우 다른 객체에서 메서드를 빌려온 후 call을 사용하면 된다.
var hasOwn = {}.hasOwnProperty;
// 다른 데에 있는 key 변수를 사용한다 가정
// 이러면 dict의 메서드가 덮어써지는 데 대한 걱정을 할 필요도 없고 dict에 없는 메서드를 사용할 수도 있다.
var result = hasOwn.call(dict, key);
```

이는 고차 함수를 정의할 때도 유용하다. this로 사용할 객체를 `thisArg`와 같은 인자로 받아서 `call`을 사용하면 된다. 이렇게 하면 f가 다른 객체의 메서드일지라도 해당 객체를 `thisArg`로 지정하여 호출할 수 있다.

```js
function mapper(f, thisArg){
  var result = [], i;
  for(i=0; i<this.length; i++){
    // 대충 f의 형식대로 호출
    result[i] = f.call(thisArg, this[i], arg1, ...);
  }
  return result;
}
```

객체에 존재하지 않을 수도 있는 메서드 호출을 위해 사용
콜백을 위한 this를 함께 받는 고차 함수를 위해 사용

- 아이템 21. apply 메서드를 사용하라

`apply` 메서드는 `call`과 비슷하지만 배열을 인수로 받는다. 이는 인자 배열을 받아서 배열 각 요소가 인자인 것처럼 함수를 호출하므로 가변 인자 함수를 호출할 때 유용하다. 인자의 개수에 상관없이 다 배열에 넣어서 호출하면 되기 때문이다.

또한 `apply`는 첫번째 인자로 this로 사용할 객체도 받는다. 그런 객체가 없을 경우 `null`을 첫번째 인수로 넘겨주면 된다.

```js
var result = f.apply(thisObj, [arg1, arg2, ...]);
```

- 아이템 22. 가변 인자 함수를 생성하기 위해 arguments를 사용하라

가변 인자 함수를 만들 땐 JS가 모든 함수에 arguments 유사 배열 객체를 제공한다. 이 객체는 함수에 전달된 모든 인자를 담고 있으며, 함수 내부에서 사용할 수 있다.

이는 length 객체와 인덱싱을 지원한다. 유사 배열 객체라 배열 메서드는 쓸 수 없다.

암튼 `arguments`는 함수에 전달된 모든 인자를 담고 있으므로 이를 이용해 가변 인자 함수를 만든다.

가변 인자 함수를 만들 땐 명시적인 배열도 받을 수 있게 항상 고정 인자 버전을 함께 제공하는 게 좋다. 가변 인자 함수의 arguments를 고정 인자 함수에 위임하는 래퍼를 작성하면 된다.

```js
function average(){
  // 1개의 인자를 받는 고정 인자 함수에 위임
  return averageOfArray(arguments);
}
```

- 아이템 23. 절대 arguments 객체를 수정하지 마라

arguments 객체는 유사 배열 객체다. 물론 call을 통해 배열 메서드를 가져와 사용할수는 있다. 그럼 이렇게 arguments 객체를 수정하면 어떻게 될까? shift 메서드를 빌려와 arguments를 수정하고 메서드를 호출하는 것이다.

```js
function callMethod(obj, method){
  var shift = [].shift;
  // arguments에서 obj, method를 뺀다
  shift.call(arguments);
  shift.call(arguments);
  console.log(arguments);
  return obj[method].apply(obj, arguments);
}

// 이렇게 쓰기를 원함
callMethod(obj, "method", arg1, arg2, ...);

var obj={
  add: function(x, y){
    return x+y;
  }
}

callMethod(obj, "add", 17, 25);
// Uncaught TypeError: Cannot read properties of undefined (reading 'apply')
```

이런 에러가 발생하는 건 arguments 객체가 함수의 arguments의 복사본이 아니고 그 자체이며, 이름이 지정된 인자는 arguments 객체에서 상응하는 인덱스들의 별명이기 때문이다. 예를 들어 `obj`는 `arguments[0]`의 별명, `method`는 `arguments[1]`의 별명이다. 이는 shift로 arguments가 수정된 후에도 마찬가지다.

따라서 위의 `callMethod`에서 `obj[method]`를 호출하는 시점에서 `arguments`는 이미 수정되어 있고 `arguments[0] ( === obj)`는 17, `arguments[1] ( === method)`는 25가 되어 있다. 따라서 위 callMethod는 `17[25].apply(17, 25)`를 호출하게 된다.

이러면 17은 Number 객체가 되고 `Number[25]`는 undefined가 되고 undefined의 apply 메서드를 호출하려고 하니 에러가 발생한다.

따라서 arguments 객체와 이름이 지정된 함수 인자 간의 관계가 매우 불안정함을 알고 있어야 한다. arguments 를 수정하면 이름이 지정된 파라미터의 값이 달라질 수 있다.

[이는 엄격 모드에서 어느 정도 수정되었다.](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Strict_mode#eval_%EA%B3%BC_arguments_%EB%A5%BC_%EB%8D%94_%EA%B0%84%EB%8B%A8%ED%95%98%EA%B2%8C_%ED%95%98%EA%B8%B0)

엄격 모드에선 arguments 객체가 함수가 호출되는 시점에 원본 인수들을 저장한다. `arguments[i]`는 이름이 붙은 인자의 값을 추적하지 않으며 이름이 붙은 인자도 상응하는 `arguments[i]`값을 추적하지 않는다. 원래는 둘이 연동되어 있었다...

처음에 arguments 객체 요소들을 진짜 배열로 복사(call + slice 이용)한 후 사용하면 안전하다.

```js
function callMethod(obj, method){
  // arguments를 복사하고 앞 2개의 인자들을 제거한 배열 만들기
  var args = [].slice.call(arguments, 2);
  // args는 obj, method 다음에 오는 인자들만 담고 있다
  return obj[method].apply(obj, args);
}

var obj={
  add: function(x, y){
    return x+y;
  }
}

callMethod(obj, "add", 17, 25); // 42
```

## 2024.08.29

- 아이템 24. 변수를 사용해 arguments의 참조를 저장하라

만약 함수에서 특정 함수를 만들어서 반환한다면 arguments 객체를 쓸 때 조심해야 한다. 함수에서 생성하는 함수 또한 그 자신의 인수로 arguments 객체를 갖기 때문이다.

이를 해결하기 위해서는 우리가 사용하고자 하는 arguments 객체를 지역 변수에 저장하고 그 변수를 사용하면 된다. 함수의 포함 관계에 주의해야 한다.

- 아이템 25. bind를 사용하라

객체 메서드를 콜백으로 전달하려 할 때는 this에 대한 주의가 필요하다. this는 함수가 어떻게 호출되는지에 따라 결정되기 때문이다.

다음과 같이 forEach에 객체 메서드 `buffer.add`를 전달하면 `this`는 `buffer`가 아니라 forEach의 디폴트 `this`인 전역 객체 `window`가 된다.

```js
var buffer = {
  entries: [],
  add: function(s){
    console.log(this);
    this.entries.push(s);
  },
  concat: function(){
    return this.entries.join("");
  }
};

var source = ["867", "-", "5309"];
source.forEach(buffer.add);
```

물론 forEach는 thisArg 인수를 제공한다. 하지만 그렇게 않을 경우 지역 함수를 만들거나 bind를 쓸 수 있다.

```js
// 방법 1
source.forEach(function(s){
  buffer.add(s);
});

// 방법 2
// this가 buffer로 고정된 새로운 함수를 만들어서 전달
// 기존 함수를 수정하는 게 아니다
source.forEach(buffer.add.bind(buffer));

// bind가 새로운 함수를 만들어서 반환한다는 것을 알 수 있다
// 따라서 어떤 메서드에 대해 bind를 호출하더라도 원본 메서드는 그대로 유지된다
buffer.add === buffer.add.bind(buffer); // false
```

- 아이템 26. 커링에 bind 사용하기

함수 bind 메서드는 this 객체를 고정할 뿐 아니라 함수들의 인수도 고정한 새로운 함수를 만들 수 있다. 이를 이용하면 커링을 쉽게 할 수 있다. `foo` 함수의 첫 번째 인자를 1로 고정한 함수를 만들고 싶다면 다음과 같이 하면 된다.

```js
var foo = function(a, b){
  return a+b;
};

var bar = foo.bind(null, 1);
```

이때 `foo`는 this를 사용하지 않기 때문에 this값으로 `null`을 넘겼다. 이렇게 this를 쓰지 않을 경우에도 bind에 this값을 전달하기는 해야 하기 때문에 관례적으로 null이나 undefined를 넘긴다.

이렇게 함수를 그 인자의 부분집합으로 호출하도록 하는 것을 커링이라고 한다. 이는 함수형 프로그래밍에서 매우 중요한 개념이다.

- 아이템 27. 코드 캡슐화를 위해 문자열보다 클로저를 사용하라

문자열 안에서 실행되는 모든 변수 참조는 eval에 의해 전역 변수로 해석된다. 때문에 함수 안에서 eval을 평가하게 될 경우에도 그 함수의 스코프가 아닌 전역 스코프에서 변수를 찾게 된다.

그러니 문자열을 eval해서 실행하는 식으로 함수를 작성하기보다는 콜백 함수를 사용하자. 이는 클로저를 사용하는 것과 같다.

```js
function repeat(n, action){
  for(var i=0; i<n; i++){
    action();
  }
}
```

또한 eval을 사용시 이런 스코프의 문제뿐 아니라 컴파일러가 최적화를 할 수 없게 되어 성능에도 영향을 미친다는 문제도 있다.

즉 문자열을 전달받아 eval하는 대신 함수를 전달받아 실행하도록 코드를 짜는 게 좋다.
