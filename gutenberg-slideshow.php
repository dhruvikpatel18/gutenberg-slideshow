<?php
/**
 * Plugin Name:       Gutenberg Slideshow
 * Description:       It provides the users with a custom Gutenberg block that fetches the latest data from a WordPress site and display data as a slideshow.
 * Version:           1.0
 * Author:            Dhruvik Malaviya
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       caraousal-slider-block
 
 */

 if(!defined('ABSPATH')){
    header("Location: /Gutenberg-Slideshow");
    die("");
 }

 function slideshow_enqueue_scripts() {
   wp_enqueue_script(
      'gutenberg-slideshow',
      plugin_dir_url(__FILE__) . 'block.js',
      ['wp-blocks', 'wp-components', 'wp-element', 'wp-api-fetch'],
      null,
      true
  );
   wp_enqueue_style('style-block', plugin_dir_url(__FILE__) . 'block.css');
}

add_action('enqueue_block_editor_assets', 'slideshow_enqueue_scripts');
?>

 