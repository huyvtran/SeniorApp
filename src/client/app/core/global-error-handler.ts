
import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { LoggingService } from './logging.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  //private logger: LoggingService;


  constructor(private injector: Injector) {

    // The true paramter tells Angular to rethrow exceptions.
    super(true);

    /*
    setTimeout(function() {
     this.logger = injector.get(LoggingService);
    },100);

    console.log(this.logger);
    */

  }

  handleError(error: any): void {
    const logger = this.injector.get(LoggingService);
    // log on the server
    //logger.log(error);

    // delegate to default handler
   super.handleError(error);

  }

}
