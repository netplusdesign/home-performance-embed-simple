module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            main: ['./dist/**']
        },
        handlebars: {
            compile: {
              options: {
                namespace: 'JST'
              },
              files: {
                './dist/js/templatesCompiled.js': './src/templates/*.handlebars'
              }
            }
        },
        copy: {
            main: {
                options: {
                    processContent: function (content, srcpath) {
                        if (srcpath == "./src/home-performance.js") {
                            // remove comments
                            return content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
                        }
                        return content;
                    }
                },
                files: [ 
                    { expand: true, flatten: true, dest: "./dist/", src: "./src/index.html"},
                    { expand: true, flatten: true, dest: "./dist/js/", 
                        src: [
                            "./src/home-performance.js", 
                            "./node_modules/moment/moment.js", 
                            "./node_modules/jquery/dist/jquery.min.js", 
                            "./node_modules/handlebars/dist/handlebars.runtime.min.js"
                        ], 
                        filter: 'isFile'}, 
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask("default", ["clean", "handlebars", "copy"]);
    grunt.registerTask("hb", ["handlebars"]);
};