const gulp = require('gulp');
const sass = require('gulp-sass');
const less = require('gulp-less');
const autopref = require('gulp-autoprefixer');
const brwSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const gcmq = require('gulp-group-css-media-queries');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const sprite = require('gulp.spritesmith');
const gulpif = require("gulp-if");
const buffer = require('vinyl-buffer');
const csso = require('gulp-csso');
const merge = require('merge-stream');
const base64 = require('gulp-base64');
const babel = require('gulp-babel');
const plumb = require('gulp-plumber');
const notify = require('gulp-notify');




var config = {
	src: './src',
	build: './build',
	css: {
		src: '/css/*.css',
		dest: '/css'
	},

	img: {
        src: '/img/*',
        dest: '/img/'
    },

	html: {
		src: '/*.html',
		dest: '/'

	},

	js: {
		src: '/js/*.js',
		dest: '/js'
	},

	sass: {
		src_scss: "/precss/*.scss",
		src_sass: "/precss/*.sass",
		dest: "/css",
	},

	less: {
		src: '/precss/*.less',
		dest: '/css'
	},

	backup: {
		srcH: '/*.html',
		srcC: '/css/*.css',
		srcJ: '/js/*js',
		dest: 'src-copy',
	},

	test: {
		src: 'src/test/*.html',
	},

};

gulp.task('prefix', function(){
	gulp.src(config.src+config.css.src)
      	.pipe(autopref({
            browsers: ['> 0.01%'],
            cascade: false
       }))
      	.pipe(gulp.dest(config.src + config.css.dest+'/style-pref'))

});

gulp.task('backup', function(){

	gulp.src(config.src+config.backup.srcH)
		.pipe(gulp.dest(config.backup.dest));
	gulp.src(config.src+config.backup.srcC)
		.pipe(gulp.dest(config.backup.dest));
	gulp.src(config.src+config.backup.srcJ)
		.pipe(gulp.dest(config.backup.dest));
});

gulp.task('sass', function(){
	gulp.src(config.src+config.sass.src_sass)
		.pipe(sass()).on('error', sass.logError)
		.pipe(gcmq())
		.pipe(sourcemaps.init())
		.pipe(autopref({
            browsers: ['> 0.01%'],
            cascade: false
       		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.src+config.sass.dest))
		.pipe(brwSync.reload({
			stream: true
		}));
});

gulp.task('scss', function(){
	gulp.src(config.src+config.sass.src_scss)
		.pipe(sass())
		.pipe(gcmq())
		.pipe(sourcemaps.init())
		.pipe(autopref({
            browsers: ['> 0.01%'],
            cascade: false
       		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.src+config.sass.dest))
		.pipe(brwSync.reload({
			stream: true
		}));
});

gulp.task('less', function(){
	gulp.src(config.src+config.less.src)
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(gcmq())
		.pipe(autopref({
            browsers: ['> 0.01%'],
            cascade: false
       		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.src+config.less.dest))
		.pipe(brwSync.reload({
			stream: true
		}));
});

gulp.task('html', function(){
	gulp.src(config.src+config.html.src)
	.pipe(gulp.dest(config.build+config.html.dest))
	.pipe(brwSync.reload({
			stream: true
		}));
});

/*gulp.task('js', function(){
	gulp.src(config.src+config.js.src)
	.pipe(gulp.dest(config.src+config.js.dest))
	.pipe(brwSync.reload({
			stream: true
		}));
});*/



gulp.task('js', function(){
	gulp.src(config.src+config.js.src)
	.pipe(plumb({
        errorHandler: notify.onError("Error: <%= error.message %>"),
    }))
	.pipe(sourcemaps.init())
	.pipe(concat('js.js'))
	.pipe(babel({
		presets: ['es2015'],
	}))
	.pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(plumb.stop())
	.pipe(gulp.dest(config.build+config.js.dest))
	.pipe(brwSync.reload({
			stream: true
		}));
});

// New
gulp.task('build:css', ['backup'], function(){
	gulp.src(config.src + config.css.src)
		.pipe(gcmq())
		.pipe(sourcemaps.init())
		.pipe(autopref({
            browsers: ['> 0.01%'],
            cascade: false
       }))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.src + config.css.dest))
});

gulp.task('bwSync', function(){
	brwSync.init({
		ui: {
		    port: 8080,
		    weinre: {
		        port: 3005
		    }
		},
        server: {
            baseDir: config.src
        }
    });
});

gulp.task('css', function(){
	gulp.src(config.src+config.css.src)
	.pipe(gulp.dest(config.src+config.css.dest))
	.pipe(brwSync.reload({
		stream: true
	}));

});

gulp.task('watch-css', ['bwSync'], function(){
	gulp.watch(config.src+config.css.src, ['css']);
	gulp.watch(config.src+config.html.src, ['html']);
});

gulp.task('watch-precss', ['bwSync'], function(){
	gulp.watch(config.src+config.less.src, ['less']);
	gulp.watch(config.src+config.sass_sass.src, ['sass']);
	gulp.watch(config.src+config.sass_scss.src, ['sass']);
});

gulp.task('watch', ['bwSync'], function(){
	gulp.watch(config.src+config.html.src, ['html']);
	gulp.watch(config.src+config.sass.src_scss, ['scss']);
	gulp.watch(config.src+config.sass.src_sass, ['sass']);
	gulp.watch(config.src+config.less.src, ['less']);
	gulp.watch(config.src+config.js.src, ['js']);
});

gulp.task('img', function(){
    gulp.src(config.src + config.img.src)
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(config.src + config.img.dest));
});

gulp.task('js:build', function(){
    gulp.src(config.src + config.js.src)
        .pipe(sourcemaps.init())
		.pipe(concat('js-babel.js'))
		.pipe(babel({
			presets: ['es2015'],
		}))
		.pipe(uglify())
	    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.src+config.js.dest));
});

gulp.task('fonts', function(){
    gulp.src(config.src + config.fonts.src)
        .pipe(gulp.dest(config.build + config.fonts.dest));
});

gulp.task('sprite:less', function () {
  var spriteData = gulp.src('src/img/icons/*.png').pipe(sprite({
    imgName: '../img/sprite.png',
    cssName: 'sprite.less',
    padding: 5,
  }));
 
  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest('src/img/'));
  var cssStream = spriteData.css
    .pipe(gulp.dest('src/precss/libs'));
  return merge(imgStream, cssStream);
});

gulp.task('sprite:scss', function () {
  var spriteData = gulp.src('src/img/icons/*.png').pipe(sprite({
    imgName: '../img/sprite.png',
    cssName: 'sprite.scss',
    padding: 5,
  }));
 
  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest('src/img/'));
  var cssStream = spriteData.css
    .pipe(gulp.dest('src/precss/libs'));
  return merge(imgStream, cssStream);
});

gulp.task('sprite:sass', function () {
  var spriteData = gulp.src('src/img/icons/*.png').pipe(sprite({
    imgName: '../img/sprite.png',
    cssName: 'sprite.sass',
    padding: 5,
  }));
 
  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest('src/img/'));
  var cssStream = spriteData.css
    .pipe(gulp.dest('src/precss/libs'));
  return merge(imgStream, cssStream);
});

gulp.task('sprite:css', function () {
  var spriteData = gulp.src('src/img/icons/*.png').pipe(sprite({
    imgName: '../img/sprite.png',
    cssName: 'sprite.css',
    padding: 5,
  }));
  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest('src/img'));
 
  var cssStream = spriteData.css
    .pipe(csso())
    .pipe(gulp.dest('src/css'));
 
  return merge(imgStream, cssStream);
});

gulp.task('del', function(){
    let path = config.build + '/*';
    
    if(path.substr(0, 1) === '/'){
        console.log("never delete files from root :)");
    }
    else{
        del.sync(path);
    }
});
    
/*gulp.task('build', ['backup', 'del', 'fonts', 'js:build', ], function(){   
    gulp.src(config.src+config.css.src)
});*/

gulp.task('base64', function () {
    return gulp.src('src/css/base64.css')
        .pipe(base64())
        /*.pipe(concat('main.css'))*/
        .pipe(gulp.dest('./src/css'));
});

gulp.task('args', function(){
	let pattern = /.*=(.*)$/;
	console.log(process);
	//console.log(process.argv[process.argv.length-1].split('=')[1]);
	//if(prompt('Yes?') === 'y'){console.log(YES)} else(console.log("NO"));
});

/*=============================================*/

var nunjucksRender = require('gulp-nunjucks-render');
var changed        = require('gulp-changed');
var prettify       = require('gulp-prettify');
var frontMatter    = require('gulp-front-matter');

function renderHtml(onlyChanged) {
    nunjucksRender.nunjucks.configure({
        watch: false,
        trimBlocks: true,
        lstripBlocks: false
    });

    return gulp
        .src([config.src + config.html.src])
        .pipe(plumb({
            errorHandler: config.errorHandler
        }))
        .pipe(gulpif(onlyChanged, changed(config.src + config.html.dest)))
        .pipe(frontMatter({ property: 'data' }))
        .pipe(nunjucksRender({
            PRODUCTION: 'development',
            path: [config.src]
        }))
        .pipe(prettify({
            indent_size: 2,
            wrap_attributes: 'auto', // 'force'
            preserve_newlines: false,
            // unformatted: [],
            end_with_newline: true
        }))
        .pipe(gulp.dest(config.build + config.html.dest));
}

gulp.task('nunjucks', function() {
    return renderHtml();
});

gulp.task('nunjucks:changed', function() {
    return renderHtml(true);
});

gulp.task('nunjucks:watch', function() {
    gulp.watch([
        config.src + config.html.src
    ], ['nunjucks:changed']);

    gulp.watch([
        config.src + config.html.src
    ], ['nunjucks']);
});