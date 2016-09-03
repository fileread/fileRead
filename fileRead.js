    angular.module('app.fileReadDirective', [])
/**
 * Fileread creates an object where:
 * object{
 *      title: name of file,
 *      data: the content
 *		mime: 
 * }
 * optional atrrs: parse-Xml -- Values: {true, false} // default: true
 */
    .directive("fileread", ['$parse', function ($parse) {
    return {
        restrict: 'A',
        scope: {
            fileread: "=",
        },
        controller: ['$scope', 'ngXml2json', function($scope,ngXml2json){

            $scope.xml2json = function(fileread) {
                var jsonOutput = ngXml2json.parser(fileread);
                return jsonOutput;
            }

        }],
        link: function (scope, element, attrs) {
            
            scope.$watch('fileread', function(value) {
              if(!value || value.default){          
                element[0].value = "";                 
              }
            });

            element.bind("change", function (changeEvent) {

                scope.fileread=null;

                var reader = new FileReader();

                var file = {
                    title: '',
                    data: '',
                    mime: ''
                };

                file.title = element[0].files[0].name;
                file.mime = element[0].files[0].type;

                var res = file.title.substr(file.title.lastIndexOf('.')) == '.xml';

                reader.onload = function (loadEvent) {
                    var parse = true;
                    scope.$apply(function () {
                        if(scope.$eval(attrs.parseXml)==false){
                            parse = scope.$eval(attrs.parseXml);
                        }
                        if(res && parse){
                            file.data = scope.xml2json(loadEvent.target.result);
                        }else{
                            file.data = loadEvent.target.result;
                            
                        }

                        scope.fileread=file;
                    });
                }

                if(res){
                    reader.readAsText(changeEvent.srcElement.files[0]);

                }else{
                    reader.readAsDataURL(changeEvent.target.files[0]);
                }
            });
        }
    }
}]);