    window.NewsModule = window.NewsModule || {};
    window.NewsModule = (function ($, window, document) {

        var sourceURLRaw = 'aHR0cHM6Ly90d2l0cnNzLm1lL3R3aXR0ZXJfdXNlcl90b19yc3MvP3VzZXI9Q29yb25hTEFURVNU';

        // Expose contents of APP.
        return {
            // NewsModule.go
            get: function (callback, failCallback) {
                this.init.getRawXML(callback, failCallback);
            },
            // NewsModule.init
            init: {
                getRawXML: function (callback, failCallback) {
                    fetch(this.b64_to_utf8(sourceURLRaw), {
                        method: 'GET',
                    })
                    .then((response) => response.text())
                    .then((result) => {
                        var newsModel = this.parseToModel(result);
                        callback(newsModel);
                    })
                    .catch((error) => {
                        failCallback(error);
                    });
                },
                parseToModel: function (data) {
                    var xmlDoc, parser, item;
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(data, "text/xml");
                    item = xmlDoc.getElementsByTagName("item");
                    var inputList = Array.prototype.slice.call(item);
                    var newsList = [];
                    inputList.forEach(e => newsList.push(this.newsFactoryGetModel(e)));
                    newsList.sort(function(a,b){
                        return new Date(b.pubDate) - new Date(a.pubDate);
                    });
                    return newsList;
                },
                b64_to_utf8: function (str) {
                    return decodeURIComponent(escape(window.atob(str)));
                },
                outputResults: function (value) {
                    console.log(value);
                },
                newsFactoryGetModel: function (item) {
                    var newsModel = new NewsModel();
                    newsModel.title = this.stripHtml(item.getElementsByTagName("title")[0].innerHTML);
                    newsModel.description = this.stripHtml(item.getElementsByTagName("description")[0].innerHTML);
                    newsModel.pubDate = new Date((Date.parse(this.stripHtml(item.getElementsByTagName("pubDate")[0].innerHTML))));
                    newsModel.link = this.stripHtml(item.getElementsByTagName("link")[0].innerHTML);
                    newsModel.guid = this.stripHtml(item.getElementsByTagName("guid")[0].innerHTML);
                    newsModel.picURL = this.stripHtml(item.getElementsByTagName("guid")[0].innerHTML);
                    return newsModel;
                },
                stripHtml: function (html) {
                    var tmp = document.createElement("DIV");
                    tmp.innerHTML = html;
                    tmp.querySelectorAll('*').forEach(n => n.remove());
                    var res = tmp.textContent || tmp.innerText || "";
                    return res.replace("]]>", "").trim();
                }
            }
        };
    })($, this, this.document);