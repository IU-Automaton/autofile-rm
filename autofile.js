'use strict';

var rimraf = require('rimraf');
var async  = require('async');
var glob   = require('glob');
var path   = require('path');

module.exports = function (task) {
    task
    .id('rm')
    .name('Remove')
    .description('Remove file or set of files.')
    .author('Indigo United')

    .option('files', 'Which files should be removed. Accepts a filename and array of filenames. Also note that the filenames can be minimatch patterns.')
    .option('glob', 'The options to pass to glob (check https://npmjs.org/package/glob for details).', null)

    .do(function (opt, ctx, next) {
        // TODO: optimize this with the expand function
        var files = Array.isArray(opt.files) ? opt.files : [opt.files];

        async.forEach(files, function (file, next) {
            glob(file, opt.glob, function (err, matches) {
                if (err) {
                    return next(err);
                }

                async.forEach(matches, function (match, next) {
                    match = path.normalize(match);
                    ctx.log.debugln('Removing ' + match);
                    rimraf(match, next);
                }, next);
            });
        }, next);
    });
};