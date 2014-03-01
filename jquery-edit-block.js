(function ($) {
  // bind listeners on a document level to catch clicks to the generated buttons
  $(document)
    .on('click', 'a[href="#editBlock"]', function (e) {
      e.preventDefault();
      $(this).parents('.edit-block').editblock('edit');
    })
    .on('click', 'a[href="#cancelEditBlock"]', function (e) {
      e.preventDefault();
      $(this).parents('.edit-block').editblock('cancel');
    })
    .on('click', 'a[href="#saveBlock"]', function (e) {
      e.preventDefault();
      $(this).parents('.edit-block').editblock('save');
    });

  // swap object with HTML, original is hidden
  var ebSwap = function (originalObject, newHtml) {
    originalObject.hide();
    $(newHtml).insertAfter(originalObject);
  };

  // swap object with DOM element, original is removed from DOM
  var ebReplace = function (originalObject, newObject) {
    originalObject.remove();
    newObject.show();
  };

  // remove form elements from parent and revert state from 'editing'
  var ebClean = function (that) {
    that.removeClass('editing');
    // remove remnants of ui elements for editing
    that.find('.ui-spinner, .redactor_box').remove();
    that.find("[role=edit]").each(function () {
      ebReplace($("[name=" + this.getAttribute('data-name') + "]"), $(this));
    });
    that.find("a[href='#cancelEditBlock'], a[href='#saveBlock']").hide();
    that.find("a[href='#editBlock']").show();
  };

  var methods = {

    init: function (options) {

      var editButton = ' <a href="#editBlock" class="button"><i class="icon-edit"></i> Edit</a> ',
        cancelButton = ' <a href="#cancelEditBlock" class="button" style="display:none"><i class="icon-ban-circle"></i> Cancel Edit</a> ',
        saveButton = ' <a href="#saveBlock" class="button" style="display:none"><i class="icon-save"></i> Save</a> ';

      return this.each(function () {

        var $this = $(this);
        
        if (!$this.hasClass('edit-block')) { $this.addClass('edit-block'); }

        $this.append('<div role="edit-buttons"></div>');
        var buttons = $this.find('div[role="edit-buttons"]');
        buttons.append(editButton).append(saveButton).append(cancelButton);

      });
    },
    cancel: function () {
      return this.each(function () {
        ebClean($(this));
      });
    },
    edit: function () {
      return this.each(function () {

        var $this = $(this);

        $this.addClass('editing');
        $this.find("[role=edit]").each(function () {

          var $item = $(this),
            inputField;

          switch ($item.data('edit')) {
            case "textarea":
            // create a textarea based on the text in the object
            // if textarea predefined as <div> with rows and cols attributes
							var cols = $item.attr('cols');
							var rows = $item.attr('rows');
							var rc = (cols == undefined ? "" : "cols='" + cols + "'") + (rows == undefined ? "" : " rows='" + rows + "'"); 
							
							inputField = '<textarea role="entry" name="' + $item.data('name') + '"'+ rc + '>' + $item.text() + '</textarea>';
              ebSwap($item, inputField);
              break;
            case "textarea-rich":
            // create a textarea with redactor
              inputField = '<textarea role="entry" name="' + $item.data('name') + '">' + $item.text() + '</textarea>';
              ebSwap($item, inputField);
              $("textarea[name=" + $item.data('name') + "]").redactor();
              break;
            case "toggle":
            // create a checkbox
              var state = $item.html() === 'Yes' ? ' checked' : '';
              inputField = '<input role="entry" type="checkbox" name="' + $item.data('name') + '"' + state + '>';
              ebSwap($item, inputField);
              break;
            case "spinner":
            // create an input with jQuery UI spinner
              inputField = '<input role="entry" size="3" name="' + $item.data('name') + '" value="' + $item.text().replace(/"/g, '&quot;') + '">';
              ebSwap($item, inputField);
              $("input[name=" + $item.data('name') + "]").spinner();
              break;
            case "text":
            default:
            // create a text field
              inputField = '<input role="entry" type="text" name="' + $item.data('name') + '" value="' + $item.text().replace(/"/g, '&quot;') + '">';
              ebSwap($item, inputField);
              break;
          }
        });
        $this.find("a[href='#cancelEditBlock'], a[href='#saveBlock']").show();
        $this.find("a[href='#editBlock']").hide();
      });
    },
    save: function () {
      return this.each(function () {

        var $this = $(this);

        $this.find("i.icon-save").removeClass("icon-save").addClass("icon-refresh icon-spin");

        // cache the form for reference later
        var form = $this.find('form[role=edit-form]');

        // post to the form's action url with the contents of the form
        $.ajax({ 
          url: form.attr('action'),
          type: form.attr('method') || 'post',
          data: form.serialize(),
          success: function (res) {
            $this.find("[role=edit]").each(function () {
              // revert all items back to "read" state
              var name = this.getAttribute('data-name');
              if (this.getAttribute('data-edit') === 'toggle') {
                var toggle = $("[name=" + name + "]").is(':checked') ? 'Yes' : 'No';
                this.innerHTML = toggle;
              } else {
                this.innerHTML = $("[name=" + name + "]").val();
              }
            });
            // remove form elements from DOM
            ebClean($this);
          },
          error: function () { window.alert('There was an error saving that information.'); },
          complete: function () {
            $this.find("i.icon-refresh").removeClass("icon-refresh icon-spin").addClass("icon-save");
          }
        });
      });
    }
  };

  $.fn.editblock = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    $.error('Method ' +  method + ' does not exist from SEP block edit plugin.');
  };

}(jQuery));
