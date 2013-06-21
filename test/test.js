/*global describe, it, beforeEach, after*/

'use strict';

var expect    = require('expect.js');
var fs        = require('fs');
var isFile    = require('./util/isFile');
var isDir     = require('./util/isDir');
var rimraf    = require('rimraf');
var rm        = require('../autofile');
var automaton = require('automaton').create();

describe('rm', function () {
    var target = __dirname + '/tmp/';

    function clean(done) {
        rimraf(target, done);
    }

    beforeEach(function (done) {
        clean(function (err) {
            if (err) {
                throw err;
            }

            fs.mkdirSync(target);
            done();
        });
    });
    after(clean);

    it('should remove files', function (done) {
        var file = 'file.js';

        // create file
        fs.writeFileSync(target + file, 'dummy');

        automaton.run(rm, {
            files: target + file
        }, function (err) {
            if (err) {
                throw err;
            }

            expect(isFile(target + file)).to.be(false);
            expect(isDir(target)).to.be(true);
            done();
        });
    });

    it('should remove folders', function (done) {
        var dir1 = target,
            dir2 = target + 'dir1',
            dir3 = target + 'dir2';

        // create dir2
        fs.mkdirSync(dir2);

        // create dir3
        fs.mkdirSync(dir3);

        automaton.run(rm, {
            files: [dir2, dir3]
        }, function (err) {
            if (err) {
                throw err;
            }
            expect(isDir(dir1)).to.be(true);
            expect(isDir(dir2)).to.be(false);
            expect(isDir(dir3)).to.be(false);
            done();
        });
    });

    it('should accept minimatch patterns', function (done) {
        var dir  = target + 'dir',
            file = 'file.js';

        // create dir
        fs.mkdirSync(dir);

        // create file
        fs.writeFileSync(dir + file, 'dummy');

        automaton.run(rm, {
            files: target + '*'
        }, function (err) {
            if (err) {
                throw err;
            }
            expect(isDir(target)).to.be(true);
            expect(isDir(dir)).to.be(false);
            expect(isFile(dir + file)).to.be(false);
            done();
        });
    });

    it('should pass over the glob options', function (done) {
        var dir  = target + 'dir',
            file = target + '.file.js';

        // create dir
        fs.mkdirSync(dir);

        // create file
        fs.writeFileSync(file, 'dummy');

        automaton.run(rm, {
            files: target + '*',
            glob: {
                dot: true
            }
        }, function (err) {
            if (err) {
                throw err;
            }

            expect(isDir(target)).to.be(true);
            expect(isDir(dir)).to.be(false);
            expect(isFile(file)).to.be(false);
            done();
        });
    });
});