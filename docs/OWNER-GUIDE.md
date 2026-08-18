# COGL Website Quick Update Guide

The website is hosted through **GitHub + Netlify**.

You usually only need to use **GitHub** to update the site. Netlify automatically publishes the changes afterward.

## Updating Text

1. Open the `cogl-website` repository on GitHub.
2. Click `index.html`.
3. Click the pencil **Edit** icon.
4. Find the text you want to change.
5. Edit it carefully.
6. Scroll down and click **Commit changes**.
7. Add a short message describing what you changed.
8. Commit the change to the `main` branch.

Example commit message:

`Update October event information`

Netlify should automatically update the live website shortly afterward.

## Updating Images

1. Open the `assets` folder.
2. Find the image you want to replace.
3. Upload the new image.
4. Keep the **same file name** if you want it to automatically replace the old image.
5. Commit the change.

Example:

Replace:

`hero-community.webp`

with a new image also named:

`hero-community.webp`

This means you usually do not need to edit the website code.

## Main Website Files

`index.html`
Controls most of the website's text and sections.

`styles.css`
Controls colors, spacing, layouts, mobile design, and visual appearance.

`script.js`
Controls interactive website features.

`assets/`
Contains website images, logos, screenshots, and other media.

`netlify.toml`
Contains Netlify hosting settings. Usually leave this alone.

## Important Rule

Before changing anything complicated, make sure you know what the code does.

For normal updates like:

* Events
* Staff information
* Server details
* Descriptions
* Images
* Links

editing `index.html` or replacing something inside `assets/` is usually enough.

## If Something Breaks

Don't panic.

GitHub keeps a history of previous versions.

You can view older commits and restore a working version if necessary.

The live website is:

**cogl.netlify.app**

## Simple Version

**Want to change words?**
Edit `index.html`.

**Want to change a picture?**
Replace it inside `assets/`.

**Done editing?**
Commit the change.

**Then what?**
Netlify automatically updates the website.
