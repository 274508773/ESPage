/*
Leaflet.draw building and linting scripts.

To use, install Node, then run the following commands in the project root:

    npm install -g jake
    npm install

To check the code for errors and build Leaflet from source, run "jake".
To run the tests, run "jake test".

For a custom build, open build/build.html in the browser and follow the instructions.
*/

var build = require('./build/build.js');

function hint(msg, paths) {
    return function () {
        console.log(msg);
        jake.exec('node node_modules/jshint/bin/jshint -c ' + paths,
                    {printStdout: true}, function () {
            console.log('\tCheck passed.\n');
            complete();
        });
    };
}

desc('Check Leaflet.draw source for errors with JSHint');
task('lint', {async: true}, hint('Checking for JS errors...', 'build/hintrc.js src'));

desc('Check Leaflet.draw specs source for errors with JSHint');
task('lintspec', {async: true}, hint('Checking for specs JS errors...', 'spec/spec.hintrc.js spec/suites'));

desc('Combine and compress Leaflet.draw source files');
task('build', {async: true}, function (vertion) {

    build.build(complete, 'vv', 'ESLib', getDefaultVertion(vertion));
});

desc('Run PhantomJS tests');
task('test', ['lint', 'lintspec'], {async: true}, function () {
    build.test(complete);
});

task('default', ['test', 'build']);

jake.addListener('complete', function () {
    process.exit();
});


// 红谷滩项目
{
    var Hgt = require('./build/HGT/build.js');



// 做四个任务，
// 第一个任务是编译基础，
// 第二个任务是编译 mapview
// 第三个任务是编译 overview
// 第四个任务是编译 CloudMap
// 第五个任务是编译 EventConfig
    task('hgt', ['hgt_mv','hgt_ov','hgt_ec','hgt_cm','track_v','track_u']);

    task('hgt_mv', {async: true}, function (vertion) {

        Hgt.build(complete, 'f', 'MapView',  getDefaultVertion(vertion),'D:\\ESWorkCode\\红谷滩渣土管理系统\\HGTMuck\\HGTMuck\\Asset\\scripts\\site\\Page\\');
    });
    task('hgt_ov', {async: true}, function (vertion) {

        Hgt.build(complete, 'h', 'OverView',  getDefaultVertion(vertion),'D:\\ESWorkCode\\红谷滩渣土管理系统\\HGTMuck\\HGTMuck\\Asset\\scripts\\site\\Page\\');
    });
    task('hgt_ec', {async: true}, function (vertion) {

        Hgt.build(complete, '21', 'EventConfig',  getDefaultVertion(vertion),'D:\\ESWorkCode\\红谷滩渣土管理系统\\HGTMuck\\HGTMuck\\Asset\\scripts\\site\\Page\\');
    });

    task('hgt_cm', {async: true}, function (vertion) {

        Hgt.build(complete, '11', 'CloudMap', getDefaultVertion(vertion),'D:\\ESWorkCode\\红谷滩渣土管理系统\\HGTMuck\\HGTMuck\\Asset\\scripts\\site\\Page\\');
    });




    function getDefaultVertion(vertion) {
        if(!vertion){
            vertion = '0.1.4'
        }
        return vertion;
    }

}

// 历史轨迹任何
{
    var Track = require('./build/Track/build.js');

    task('track', ['build','track_v']);

    task('track_v', {async: true}, function (vertion) {
        Track.build(complete, '7vvv', 'TrackView',  getDefaultVertion(vertion));
    });

    task('track_u', {async: true}, function (vertion) {
        Track.build(complete, 'fvvv', 'UserTrack',  getDefaultVertion(vertion));
    });

}


// 云图设计
{
    var CM = require('./build/CloudMap/build.js');

    task('cm', {async: true}, function (vertion) {

        CM.build(complete, '7', 'CloudMapOF', getDefaultVertion(vertion),'D:\\hbgps\\workspace\\hbgps\\web\\Asset\\scripts\\site\\Page\\');
    });
}



