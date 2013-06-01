jquery-edit-block
=================

Allow for easy editing of a block of information while maintaining semantic HTML and not requiring a ton of dependencies.

## Usage

```html
<div id="contactInformation">
  <form method="post" action="saveContact.php" role="edit-form">
    <label>First Name</label>
    <span data-name="firstName" role="edit">Sam</span>
    <label>Last Name</label>
    <span data-name="lastName" role="edit">Beckett</span>
    <label>Occupation</label>
    <span data-name="occupation" role="edit">Quantum Physicist</span>
    <label>Bio</label>
    <p data-name="bio" role="edit" data-edit="textarea">
      Theorizing that one could time travel within his own lifetime, Dr. Sam Beckett stepped
      into the quantum leap accelerator and vanished. He awoke to find himself trapped in the past,
      facing mirror images that were not his own, and driven by an unknown force to change history for the better.
      His only guide on this journey is Al, an observer from his own time, who appears in the form of a hologram
      that only Sam can see and hear. And so, Dr. Beckett finds himself leaping from life to life, 
      striving to put right what once went wrong, and hoping each time that his next leap will be the leap home.
    </p>
  </form>
</div>
```

```js
$(function () {
  $("#contactInformation").editblock();
});
```

..and that's it! Possible options for `data-edit` are `textarea`, `toggle`, and `text` which is the default if none
is specified.

There's a [demo here](http://jessekeane.me/science.html) of what it looks like
when (optionally) paired with [Font Awesome](http://fortawesome.github.io/Font-Awesome/)
and [Foundation](http://foundation.zurb.com/). Also, if using [redactor](http://imperavi.com/redactor/) you can specify `textarea-rich` as the `data-edit`
attribute for a redactor WYSIWYG entry. If using [jQuery UI](http://jqueryui.com/) you can specify `spinner` to make a jQuery UI spinner.

## Styling information
When initialized, the class `edit-block` is added to the element.

While the element is in "edit mode" it will have the class `editing` added to it.

The buttons are of class `button`

## License
BSD
