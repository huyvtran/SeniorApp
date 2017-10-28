import * as gulp from 'gulp';
import { join } from 'path';

import Config from '../../config';

export = () => {
return gulp.src(join(Config.APP_SRC, 'login.html'))
      .pipe(gulp.dest(Config.APP_DEST));
};
