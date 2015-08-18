var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('develop', function () {
    nodemon({ script: 'app.js', ext: 'html js', ignore: ['ignored.js'] })
        .on('restart', function () {
            console.log('restarted!')
        })
})
