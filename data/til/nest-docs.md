# Nest.js 문서를 읽고 해보자

https://docs.nestjs.com/ 를 읽고 시작해 보는 중. Prisma를 사용해 보려고 함

Node.JS의 새로운 파트너 NestJS는 왜 탄생했을까?

https://goldenrabbit.co.kr/2023/06/05/nestjs/

설치와 프로젝트 생성. 이때 패키지 매니저는 pnpm으로 설정

```bash
npm i -g @nestjs/cli
nest new nestjs-docs
```

그럼 src 폴더와 내부에 컨트롤러, 서비스, 모듈 파일이 생성됨(app 기준). `src/main.ts` 파일이 앱의 진입점이 됨. 여기서 App Module의 인스턴스를 만든다.

`pnpm run start`나 `pnpm run start:dev`

## 컨트롤러

요청을 받아서 클라이언트에 응답을 돌려주는 역할. 라우팅에 따라 어떤 컨트롤러가 어떤 요청을 처리할지 달라짐

클래스 + 데코레이터로 컨트롤러 만듬

CRUD generator가 있다. 이 명령으로 특정 이름의 리소스에 대한 CRUD API를 생성할 수 있음(`--no-spec` 옵션으로 테스트 파일 생성을 막을 수 있음)

```bash
nest g resource
```

컨트롤러만 생성하려면 `nest g controller [name]` 명령어 사용. 이러면 새로운 컨트롤러가 app module의 controllers에도 자동으로 추가됨.

이때 중요한 건 메서드에 바인딩된 데코레이터이지 메서드 이름이 아니다. 물론 메서드 이름은 의미를 드러내도록 잘 지어야 하지만..

HTTP 응답 코드는 `@HttpCode(...)` 데코레이터로 변경가능.(기본은 200, post의 경우 기본 201) 물론 응답 코드는 여러 상황에 따라 바뀔 수 있다. 이럴 경우 `@Res()` 데코레이터로 응답 객체를 주입받아 직접 응답 코드를 설정할 수 있음

request 객체는 `@Req()` 데코레이터로 주입받을 수 있음

```ts
@Controller('cats')
export class CatsController {
  // HTTP 메서드별로 데코레이터가 있음
  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }
}
```

이때 `@Req` 는 `@Request`와 같으며 응답 객체도 `@Res` 혹은 `@Response`로 주입받을 수 있음

패턴 기반 라우팅도 가능함. 예를 드어 `@Get(ab*cd)`등 가능(express에서만 지원)

`@Header` 데코레이터로 응답 헤더도 설정 가능

```ts
@Post()
@Header('Cache-Control', 'no-store')
create() {
  return 'This action adds a new cat';
}
```

다른 데코레이터들

```ts
// 리다이렉트. 메서드 리턴값이 있으면 리턴값으로 오버라이딩됨
@Redirect(url, statusCode)
// 라우트 매개변수 토큰을 이용한 라우트 경로
@Get(:id) // @Param 데코레이터 이용한 매개변수로 params.id처럼 접근 가능. 혹은 @Param('id') id 처럼 매개변수를 선언
@Controller({ host: 'admin.example.com' }) // 들어오는 HTTP 호스트가 특정 값과 일치하도록 요구. 여기에 있는 파라미터 매개변수는 @HostParam으로 접근 가능
```

이런 데코레이터 대신 `@Res res`를 사용해서 라이브러리(express 등)의 응답 객체를 사용할 수도 있고 그러면 더 유연성이 높아지기는 한다. 하지만 테스트도 어려워지고 여러가지로 주의해서 사용해야 함. 그리고 nest의 표준 데코레이터(`@HttpCode()` 등)와의 호환성도 잃는다.

nest는 DTO로 클래스 사용을 권장. 클래스는 ts가 변환되어도 유지되기 때문. 반면 인터페이스는 트랜스파일하면 없어진다. 클래스를 써야 파이프 등을 사용해서 런타임에 변수의 메타 타입에 접근 가능

## Provider

Provider는 Nest의 대부분 클래스들. 서비스/레포지토리/팩토리 등등. 이것들을 주입해 가며 앱 만들기 가능

컨트롤러는 HTTP 요청을 핸들링하고 더 복잡한 로직을 Provider에 위임한다. Provider는 `.module.ts` 파일에 providers로 등록된 JavaScript 클래스이다.

서비스 생성 `nest g service [name]`

Injectable 데코레이터로 서비스가 Provider 클래스임을 표시. 이 데코레이터는 클래스가 Nest IoC 컨테이너에 주입될 수 있다는 것을 나타낸다.

## Modules

`@Module` 데코레이터로 표시. nest가 애플리케이션 구조를 구성하는 데 사용. root 모듈에서 시작해서 애플리케이션을 그래프로 구성.

각 모듈은 연관된 기능을 캡슐화하고, 애플리케이션은 이러한 여러 모듈을 사용해서 아키텍처를 구성한다.

```ts
@Module({
  // 이 모듈에서 요구하는 프로바이더들을 export하는 모듈들을 import
  imports: [CatsModule],
  // 이 모듈에서 사용할 컨트롤러
  controllers: [AppController],
  // nest injector에 의해 인스턴스화되고 모듈에서 공유될 프로바이더
  providers: [AppService],
  // 이 모듈에서 export할 프로바이더. 이 모듈을 import한 모듈에서는 여기서 export한 프로바이더를 사용할 수 있음
  exports: [],
})
```

연관된 기능은 하나의 모듈로 묶는 게 좋다. 모듈 생성은 `nest g module [name]`으로 생성 가능

nets 모듈은 기본적으로 싱글톤. 따라서 같은 프로바이더 인스턴스를 여러 모듈에서 공유/ 재사용 가능. 예를 들어 `CatsService` 를 모듈의 `exports`에 추가하면 `CatsModule`을 import한 모듈에서 `CatsService`를 사용할 수 있음

물론 각 모듈에 `CatsService`를 추가하는 것도 가능. 하지만 그러면 각 모듈에 새로운 `CatsService` 인스턴스가 생성됨. 이러면 메모리 사용도 늘어나고 상태 일관성도 깨질 수 있다.(서비스가 내부 상태를 가질 경우). 만약 프로바이더를 모듈을 통해 공유하면 프로바이더 인스턴스가 1개만 생성되고 이를 여러 모듈에서 공유할 수 있으므로 이런 문제가 없다.

모듈 또한 프로바이더를 주입받을 수 있다. 설정 등의 목적으로. 하지만 모듈 자체는 순환 종속성 때문에 프로바이더로 주입할 수 없다.

모듈을 어디서나 접근 가능하게 하려면 `@Global()` 데코레이터 사용. 물론 이렇게 모듈을 전역으로 만드는 게 좋은 것은 아님. 모듈은 가능한 한 지역적으로 유지하는 게 좋다.

Provider를 동적으로 등록할 수도 있는 커스텀 모듈을 만들 수도 있다. 이는 이후에 동적 모듈 문서에서 또 다룸

## Middleware

미들웨어: 라우트 핸들러 이전에 호출되며 req/res 객체에 접근 가능. next()도 사용 가능(express 미들웨어랑 비슷). 만약 요청-응답 사이클을 끝내는 게 아니라면 `next()` 호출 필수

함수 혹은 `@Injectable()` 데코레이터를 붙인 클래스로 만들 수 있음. 클래스로 미들웨어를 구현할 경우 `NestMiddleware` 인터페이스를 구현해야 함

모듈에 의존성 주입으로 사용. 모듈 클래스의 `configure()` 메서드에서 `consumer.apply` 하기. 미들웨어를 사용하는 모듈은 `NestModule` 을 구현해야 한다.

이때 특정 요청에만 반응하게 하려면 `configure` 인수인 `consumer`의 `forRoutes()` 메서드를 사용. 이 메서드는 라우트 경로를 받아서 미들웨어를 적용한다. 반대로 `exclude` 메서드로 특정 경로를 제외할 수도 있다.

```ts
consumer.apply(LoggerMiddleware).forRoutes(CatsController);
// forRoutes({path: 'cats', method: RequestMethod.GET}) 처럼 객체 전달도 가능
```

express를 사용하면 nest는 자동으로 body-parser 적용. 이걸 끄고 싶으면 글로벌 미들웨어에서 bodyParser 옵션 사용

여기도 와일드카드 라우트(`ab*cd` 같은) 지원

만약 미들웨어가 가져야 하는 상태나 의존성이 없다면 함수 형태로 미들웨어 구현도 가능

## Exception

`HttpException` 클래스를 상속해서 예외를 만들 수 있음. 이 생성자는 response(문자열 혹은 객체), HTTP status code를 인수로 받음. 이 코드는 HttpStatus enum을 쓰면 좋다

대부분은 내장 예외를 사용하면 된다. 그런데 커스텀 예외를 만들어야 한다면 `HttpException` 클래스를 상속하여 예외의 위계를 만들자. 이렇게 하면 Nest가 예외를 인식할 수 있다. 물론 이렇게 HttpException을 상속하여 이미 만들어진 `ForbiddenException`들이 이미 있다.

그런데 예외 처리를 완벽히 제어하기 위해서는 exception filter를 사용해야 한다. `ExceptionFilter`를 구현하는 클래스를 만들면 된다.

그렇게 필터를 만들면 `UseFilters` 데코레이터로 적용가능. 이때 필터 클래스 인스턴스를 넘길수도 있지만 nest가 메모리를 잘 쓰도록 하기 위해서는 클래스 자체를 넘기는 게 좋다. 그러면 nest가 인스턴스를 만들고 나서 재사용 가능

이 UseFilters 데코레이터는 컨트롤러 등 다른 스코프에도 적용 가능. 예외 필터를 글로벌로 적용하려면 `app.useGlobalFilters` 메서드 사용

`@Catch()` 데코레이터를 인자 없이 쓰면 모든 예외를 잡는 필터 클래스를 만들 수 있다.

이외에도 `BaseExceptionFilter` 확장 등 몇 가지 테크닉이 있음

## Pipe

파이프는 `PipeTransform` 인터페이스를 구현하며 `@Injectable()` 데코레이터를 붙인 클래스로 만들 수 있다. 입력 데이터를 특정 형태로 변환하거나 유효성 검사를 하는 데에 일반적으로 쓰임.

파이프는 컨트롤러 메서드의 인수에 적용할 수 있다. 이렇게 파이프가 변환하거나 검사한 후 메서드가 실행됨

내장 파이프나 커스텀 파이프 만들어서 사용 가능. 내장 파이프는 `ValidationPipe`, `ParseIntPipe` 등이 있음(https://docs.nestjs.com/pipes#built-in-pipes). 이름만 봐도 역할은 유추 가능

파이프는 유효성 검사나 parsing이 실패하면 라우트 핸들러 호출 전에 에러를 발생시킨다. 파이프를 적용시키고 싶은 parameter의 데코레이터에 파이프 클래스 혹은 파이프 인스턴스를 넘기면 된다.

```ts
findOne(@Param('id', ParseIntPipe) id: number)
findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
)
```

커스텀 파이프를 구현할 때는 `PipeTransform<T, R>` 인터페이스를 구현해야 한다.

이때 `transform` 메서드는 `value`와 `metadata`를 인자로 받는다. `value`는 파이프가 변환할 값이고 `metadata`는 데코레이터에서 넘긴 메타데이터이다. interface는 타입스크립트 컴파일 과정에서 사라지기 때문에 메서드 파라미터 타입이 interface라면 이건 `metatype`은 `Object`가 된다.

어떻게 사용하건, 내장을 사용하건 커스텀을 하건 파이프를 사용하면 데이터를 검증하거나 라우트 핸들러에 전달할 데이터를 적절히 변환 가능하다. 예를 들어 기본값을 제공하거나 id를 파라미터로 받았지만 라우트 핸들러엔 유저 데이터를 넘기는 것도 가능하다.

class-transformer와 class-validator를 사용하면 DTO를 사용할 때 유용하다. 이건 DTO에 데코레이터를 붙여서 데이터를 검증하거나 변환하는 데 사용한다.

```ts
export class CreateCatDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
```

## Guards

가드는 `CanActivate` 인터페이스(`canActivate` 메서드를 구현해야 함. 이 요청이 허락될지에 따라 boolean 반환하는 메서드)를 구현하는 `@Injectable()` 클래스다. 주어진 요청이 라우트 핸들러에 전달될지를 결정하는 단일 책임을 가짐. 흔히 권한 인가 등의 접근제어에 쓰인다. 어떤 실행 맥락에 있는지를 알고 있다는 점에서 미들웨어보다 인가에 적절함

미들웨어 다음에 가드가 실행된다. 그리고 가드는 인터셉터나 파이프가 실행되기 전에 실행된다.

`@UseGuards` 로 부착한다. 혹은 글로벌 가드의 경우 `useGlobalGuards()` 메서드 사용

## Interceptors

인터셉터는 `@Injectable()` 데코레이터를 붙인 클래스로 만들 수 있다. `NestInterceptor` 인터페이스 구현해야 함. 즉 `intercept()` 메서드를 가진다. 이는 2개의 인수를 가지는 메서드이고 여기서 `handle`을 호출할 시 라우트 핸들러가 호출됨

pipe, guard랑 비슷하게 이것도 `@UseInterceptors(인터셉터 클래스)`로 사용 가능.(물론 인스턴스 직접 전달도 가능하기는 하다) 글로벌 인터셉터는 `useGlobalInterceptors()` 메서드로 사용

# Custom route decorators

nest는 데코레이터를 기반으로 한다. `@Param` 같은 것들이 있음. 이때 `createParamDecorator` 같은 함수를 이용해 데코레이터를 만들 수도 있다. 요청 객체에 새로운 속성을 붙이는 등에 사용 가능

인증 계층에서 user entity를 가져오는 등에 쓸 수 있음

```ts
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
```

`createParamDecorator`는 제네릭 타입을 가지며 콜백이 받는 인수의 `data` 타입에 따라 제네릭 타입 결정됨

`applyDecorators`로 데코레이터를 조합해서 사용도 가능

