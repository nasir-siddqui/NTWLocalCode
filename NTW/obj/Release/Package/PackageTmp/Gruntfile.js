module.exports = function(grunt) {
    
    grunt.initConfig({

        less: {
            options: {
                cleancss: true
            },
            main: {
                files: [
                    { src: "framework/styles/less/ts-default.less", dest: "framework/styles/css/ts-default.css" },
                    { src: "framework/styles/less/ts-ie-lte8.less", dest: "framework/styles/css/ts-ie-lte8.css" }
                ]
            },
            mybusiness: {
                files: [
                    { src: "projects/ntw/assets/less/ts-mybusiness.less", dest: "projects/ntw/assets/css/ts-mybusiness.css" },
                    { src: "projects/ntw/assets/less/ts-mybusiness-ie-lte8.less", dest: "projects/ntw/assets/css/ts-mybusiness-ie-lte8.css" },
                    { src: "projects/ntw/assets/less/ts-mybusiness-merge.less", dest: "projects/ntw/assets/css/ts-mybusiness-merge.css" },
                    { src: "projects/ntw/assets/less/ts-mybusiness-merge-ie-lte8.less", dest: "projects/ntw/assets/css/ts-mybusiness-merge-ie-lte8.css" }
                ]
            }
        },

        bless: {
            options: {
                imports: false
            },
            main: {
                files: [{
                    src: "framework/styles/css/ts-ie-lte8.css",
                    dest: "framework/styles/css/ts-ie-lte8.css"
                }]
            },
            mybusiness: {
                files: [{
                	src: "projects/ntw/assets/css/ts-mybusiness-ie-lte8.css",
                	dest: "projects/ntw/assets/css/ts-mybusiness-ie-lte8.css"
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-bless');

    grunt.registerTask("build", ["less:main", "bless:main"]);
    grunt.registerTask("mybusiness", ["less", "bless"]);

};