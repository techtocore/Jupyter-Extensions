/**
 * main.js
 * An extension that replaces all the "SWAN" strings located inside markdown cells with the SWAN logo.
 *
 *
 * @author  Akash Ravi, https://github.com/techtocore
 * @updated 24-03-2019
 *
 *
 */

define(["base/js/namespace", "base/js/events", "jquery", "require"], function(
  Jupyter,
  events,
  $,
  requirejs
) {
  var replaceAll = function(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  };

  var add_image = function(text) {
    let html = text;
    let img_src = requirejs.toUrl("./logo_swan_cloudhisto.png"); // loads image path

    html = replaceAll(
      html,
      "SWAN",
      "<img class='swan_logo' src='" + img_src + "'>"
    ); //replaces all the word 'swan' with the image

    return html;
  };

  var addstyle = function() {
    $(".swan_logo").css({
      height: "1em", // to make the image smaller and neat
      display: "inline", // to override the global CSS that sets it to 'block'
      "margin-top": "0em"
    });
  };

  var process = function(cell) {
    let element = cell.element.find("div.text_cell_render"); // get DOM

    let html = element[0].innerHTML; // get the HTML of the markdown
    let modified_html = add_image(html);
    $(element[0]).html(modified_html); // injects HTML code

    addstyle(); // Adds styling to injected image
  };

  var excute_callback = function(event, data) {
    let cell = data.cell;
    process(cell);
  };

  var update_md_cells = function() {
    var ncells = Jupyter.notebook.ncells();
    var cells = Jupyter.notebook.get_cells();
    for (let i = 0; i < ncells; i++) {
      let cell = cells[i];
      if (cell.cell_type === "markdown") {
        process(cell); // process only cells of the type 'markdown'
      }
    } // iterate through all the cells present
  };

  var load_ipython_extension = function() {
    events.on("rendered.MarkdownCell", excute_callback); // run when a markdown is executed
    events.on("kernel_ready.Kernel", function() {
      if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
        update_md_cells();
      } else {
        events.on("notebook_loaded.Notebook", function() {
          update_md_cells();
        });
      }
    }); // run at the start of the notebook
  };
  return {
    load_ipython_extension: load_ipython_extension
  };
});
