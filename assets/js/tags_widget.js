
var tag_container=document.getElementById("tag_container");
var tag_input=document.getElementById("tag_input");
var tdel=document.getElementsByClassName("tag_del");

for(i=0;i<tdel.length;i++){
  tdel[i].parentNode['action'] = 'javascript:void(0)';
  tdel[i].parentNode.children[0].remove();
  tdel[i].parentNode.children[0].remove();
  tdel[i].type="button";
  tdel[i].onclick=remove_tag;
}

tag_input.children[0].action = 'javascript:void(0)';
tag_input.children[0].children[0].remove();
tag_input.children[0].children[0].placeholder = "add tags";
tag_input.children[0].children[0].onkeypress = add_tags;

function insert_tag_node(tag){
  tmpl=document.createElement("div");
  tmpl.className="tag"
  tmpl.innerHTML='<form action="javascript:void(0)" method="post">\
                <span>' + tag + '</span> <span style="color:#999999;">|</span>\
                <button type="button" class="tag_del icon ion-md-trash"></button></form>';
  tmpl.children[0].children[2].onclick=remove_tag;

  tag_container.appendChild(tmpl);
}

function add_tags(e){
  if(e.keyCode == 13) {
    e.preventDefault();
    tgs=e.target.value.split(" ");
    e.target.value="";
    for(i=0;i<tgs.length;i++)call_add_tag(5,tgs[i]);
  }
}


function call_add_tag(retries = 5,tag) {

  if (retries <= 0) {
      console.log('Failed to add tag.');
      return;
  }

  var url = '/subscription_ajax?action_add_subtag=1&redirect=false' +
      '&c=' + subscribe_data.ucid;
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.timeout = 10000;
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            insert_tag_node(tag);
          }
      }
  }

  xhr.onerror = function () {
      console.log('Adding tag failed... ' + retries + '/5');
      setTimeout(function () { add_tag(retries - 1,tag) }, 1000);
  }

  xhr.ontimeout = function () {
      console.log('Adding tag failed... ' + retries + '/5');
      add_tag(retries - 1,tag);
  }

  xhr.send('csrf_token=' + subscribe_data.csrf_token + '&t=' + tag);
}


function remove_tag(e){
  call_remove_tag(5,e.toElement.parentNode.children[0].innerText,e.toElement.parentNode.parentNode);

}

function call_remove_tag(retries = 5,tag,html_node) {

  if (retries <= 0) {
      console.log('Failed to remove tag.');
      return;
  }

  var url = '/subscription_ajax?action_remove_subtag=1&redirect=false' +
      '&c=' + subscribe_data.ucid;
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.timeout = 10000;
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            html_node.remove();
          }
      }
  }

  xhr.onerror = function () {
      console.log('Removing tag failed... ' + retries + '/5');
      setTimeout(function () { call_remove_tag(retries - 1,tag,html_node) }, 1000);
  }

  xhr.ontimeout = function () {
      console.log('Removing tag failed... ' + retries + '/5');
      call_remove_tag(retries - 1,tag,html_node);
  }

  xhr.send('csrf_token=' + subscribe_data.csrf_token + '&t=' + tag);
}
