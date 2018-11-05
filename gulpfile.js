const gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('start', () => {
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            port: 1111
        },
        ignore: ['./node_modules/**']
    }).on('restart', () => {
        console.log('Server Restarted');
    });
});
