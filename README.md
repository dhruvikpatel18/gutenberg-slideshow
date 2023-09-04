# Gutenberg Slideshow - WordPress Plugin

A custom Gutenberg block that fetches and displays the latest data from WP site using the WP REST API.

## Description

Gutenberg Slideshow is a WordPress plugin that provides a custom Gutenberg block for displaying a slideshow of the latest content from WP sites. This block fetches data from the WP REST API and presents it in an interactive slideshow format. Users can navigate through the slides, click on titles or images to view the full posts, and more.

## Features

- Fetches and displays the latest content from WP sites using the WP REST API.
- Interactive slideshow with navigation controls.
- Clickable titles and images that open the original post.
- Keyboard navigation support.
- Responsive design for optimal viewing on various devices.
- Ability to change the source website URL with a click of a button.
- Caching for improved performance.

## Installation

1. Upload the `Gutenberg Slideshow` folder to the `/wp-content/plugins/` directory or install the plugin via the WordPress admin panel.
2. Activate the plugin through the 'Plugins' menu in WordPress.

## Usage

1. Create or edit a post or page in the WordPress block editor.
2. Add a new block and search for "rtcamp Slideshow" or find it in the "Common" category.
3. Configure the block settings, such as toggling visual elements or metadata.
4. You can enter the url of any WP sites and it fetch and display the latest site's content.

## Block Settings

The Gutenberg Slideshow block offers several settings for customization:

- Toggle various visual elements.
- Control the behavior of the slider, including auto-scroll.
- Render manual navigation controls.
- Customize the appearance of the slideshow.

## Keyboard Navigation

- Use the right arrow key to move to the next slide.
- Use the left arrow key to move to the previous slide.

## Responsive Design

The slideshow adapts to different screen sizes and devices for a seamless viewing experience. Media queries are used to adjust styling based on screen width.

## Changing Website Source

1. Enter the desired website URL in the "API Endpoint URL" field.
2. Click the "Fetch Data" button to load content from the new source website.
3. The slideshow will now display content from the updated URL.

## Caching

The plugin uses browser local storage to cache fetched data, improving performance by reducing the number of API requests. You can manually clear the cache using the "Clear Cache" button.

## License

This plugin is licensed under the GPL License. See the GPL-2.0-or-later file for details.
