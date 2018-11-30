$(document).ready(function() {
  
    getFetch();
    
                      
    function getFetch() {
      var $wrapper = $('.wrapper');      
      $.ajax({
        url: '/getResults',
        type: 'get',
        dataType: 'json',
        error: function (xhr) {
          alert('error: ' + xhr);
        },
        success: function (response) {
          console.log(response.obj)
          if(response.success) {
            var output ='<!-- Start Rending Posts-->';
            var num_of_groups = response.obj.length;
            var next;
            for (var i= 0;  i < num_of_groups; i++) {            
              var group = response.obj[i];
              console.log(group.groupid)
              if (i+1 < num_of_groups) {
                next = response.obj[i+1];
                var go = next.groupid != group.groupid; 
              } else {
                var go = true;
              };
              if (go) {
                var telapsed = Math.round((Date.now() - group.ts)/60000);
                output += '<article><div class="post" id="group' + group.groupid + '"><div class="avatar">'+ group.groupid +'</div><h2>Group ' + group.groupid + '<br><span class="ts">' + telapsed  + '分鐘 · <i class="fa fa-globe"></i></span>' + '</h2><p>' + group.textcontent.replace(/\r\n/g, '<br>') +'</p>';
                if (group.image) {
                  output += '<p><img src="' + group.image.replace('/app','') + '"></p>';
                };
                output += '<div class="reaction-bar"><div class="reactions"><i class="fa fa-thumbs-o-up"></i> 讚好</div><div class="reactions"><i class="fa fa-comment-o"></i> 回應</div><div class="reactions"><i class="fa fa-share"></i> 分享</div></div>'
                output += '</div></article>';
              };
            }
            output += '<!-- End Rending Posts -->'
            
            $wrapper.html(output);
          } else {
            $wrapper.html('<h2>未有上載的記錄資料！</h2><p>');
          }
        }
      });
    }
});