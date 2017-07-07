var SELECT = 4; // 0001
var EDIT = 2; // 010
var REMOVE = 1; // 100

function getTableButtons(name, buttons) {
//ser <- 9f 
    var selectButton = ''
    var editButton  = ''
    var removeButton = ''
    if ( buttons.toString(2) & SELECT) {
      selectButton = '<div style="display: inline-flex"><button type="button" class="btn btn-primary btn-sm" title="Select" id="'+name+'select">Select</button> &nbsp; '
    }
    if ( buttons.toString(2) & EDIT) {
      editButton = '<div style="display: inline-flex"><button type="button" class="btn btn-primary btn-sm" title="Edit" id="'+name+'edit" data-toggle="modal" data-target="#'+name+'modal">Edit</button> &nbsp;'
    }
    if ( buttons.toString(2) & REMOVE) {
      removeButton = '<button type="button" class="btn btn-primary btn-sm" title="Remove" id="'+name+'remove">Remove</button></div>'
    }
    return selectButton + editButton + removeButton
}