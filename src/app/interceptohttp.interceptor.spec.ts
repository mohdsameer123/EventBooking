import { TestBed } from '@angular/core/testing';

import { InterceptohttpInterceptor } from './interceptohttp.interceptor';

describe('InterceptohttpInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      InterceptohttpInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: InterceptohttpInterceptor = TestBed.inject(InterceptohttpInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
