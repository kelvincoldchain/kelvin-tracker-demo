$(document).ready(function(){var config={siteURL:'songslover.org',searchSite:true,type:'web',append:false,perPage:5,page:0}
var arrow=$('<span>',{className:'arrow'}).appendTo('ul.gsearch-icons');$('ul.gsearch-icons li').click(function(){var el=$(this);if(el.hasClass('active')){return false;}
el.siblings().removeClass('active');el.addClass('active');arrow.stop().animate({left:el.position().left,marginLeft:(el.width()/2)-4});config.type=el.attr('data-searchType');$('#gmore').fadeOut();});$('#siteNameLabel').append(' '+config.siteURL);$('#searchSite').click();$('li.web').click();$('#gsearch1').focus();$('#gsearchForm').submit(function(){googleSearch();return false;});$('#searchSite,#searchWeb').change(function(){config.searchSite=this.id=='searchSite';});function googleSearch(settings){settings=$.extend({},config,settings);settings.term=settings.term||$('#gsearch1').val();if(settings.searchSite){settings.term='site:'+settings.siteURL+' '+settings.term;}
var apiURL='http://ajax.googleapis.com/ajax/services/search/'+settings.type+'?v=1.0&callback=?';var resultsDiv=$('#resultsDiv');$.getJSON(apiURL,{q:settings.term,rsz:settings.perPage,start:settings.page*settings.perPage},function(r){var results=r.responseData.results;$('#gmore').remove();if(results.length){var gpageContainer=$('<div>',{className:'gpageContainer'});for(var i=0;i<results.length;i++){gpageContainer.append(new result(results[i])+'');}
if(!settings.append){resultsDiv.empty();}
gpageContainer.append('<div class="clear"></div>').hide().appendTo(resultsDiv).fadeIn('slow');var cursor=r.responseData.cursor;if(+cursor.estimatedResultCount>(settings.page+1)*settings.perPage){$('<div>',{id:'gmore'}).appendTo(resultsDiv).click(function(){googleSearch({append:true,page:settings.page+1});$(this).fadeOut();});}}
else{resultsDiv.empty();$('<p>',{className:'notFound',html:'No Results Were Found!'}).hide().appendTo(resultsDiv).fadeIn();}});}
function result(r){var arr=[];switch(r.GsearchResultClass){case'GwebSearch':arr=['<div class="webResult">','<h2><a href="',r.unescapedUrl,'" target="_blank">',r.title,'</a></h2>','<p>',r.content,'</p>','<a href="',r.unescapedUrl,'" target="_blank">(',r.unescapedUrl,')</a><br>','</div>'];break;case'GimageSearch':arr=['<div class="imageResult">','<a target="_blank" href="',r.unescapedUrl,'" title="',r.titleNoFormatting,'" class="pic" style="width:',r.tbWidth,'px;height:',r.tbHeight,'px;">','<img src="',r.tbUrl,'" width="',r.tbWidth,'" height="',r.tbHeight,'" /></a>','<div class="clear"></div>','<a href="',r.originalContextUrl,'" target="_blank">',r.visibleUrl,'</a>','</div>'];break;case'GvideoSearch':arr=['<div class="imageResult">','<a target="_blank" href="',r.url,'" title="',r.titleNoFormatting,'" class="pic" style="width:150px;height:auto;">','<img src="',r.tbUrl,'" width="100%" /></a>','<div class="clear"></div>','<a href="',r.originalContextUrl,'" target="_blank">',r.publisher,'</a>','</div>'];break;case'GnewsSearch':arr=['<div class="webResult">','<h2><a href="',r.unescapedUrl,'" target="_blank">',r.title,'</a></h2>','<p>',r.content,'</p>','<a href="',r.unescapedUrl,'" target="_blank">',r.publisher,'</a>','</div>'];break;}
this.toString=function(){return arr.join('');}}});