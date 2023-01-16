import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {TestUtils} from "./utils/tests/TestUtils";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ServiceTemplateInstanceList} from "./utils/tests/ServiceTemplateInstanceList";
import {
  delay,
  filter, finalize,
  interval,
  repeat,
  retry, Subject,
  switchAll,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  tap,
  timeout
} from "rxjs";
import {startWith} from "rxjs/operators";


describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [
        AppComponent
      ], providers: [TestUtils, HttpClient]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'iacmf-ui'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('iacmf-ui');
  });

  it('Integration Test with backend and Use Case', () => {

    // do stuff
    let testUtils: TestUtils = TestBed.get(TestUtils);
    testUtils.setupTestEnvironment()
    let foundInstance = false
    const subject: Subject<boolean> = new Subject();
    const completeSubject = () => {
      subject.next(true)
      subject.complete();
    }

    testUtils.getAppInstances().pipe(
      delay(30000),
      tap(res => {
        if (res.service_template_instances.length > 0 && res.service_template_instances[0].state.includes("CREATED")) {
          completeSubject();
          foundInstance = true;
          expect(foundInstance).toBeTruthy()
        }
      }),
      takeUntil(subject),
      repeat(),
      finalize(() => completeSubject())
    );

    expect(subject).toBeTruthy()
  })

});


