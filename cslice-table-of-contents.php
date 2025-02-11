<?php
/**
 * Plugin Name:         Creative Slice - Table of Contents Block
 * Description:         Block showing table of contents with dynamic links to headings on the page
 * Version:             2025.02.10
 * Requires at least:   6.6
 * Tested up to:        6.7.1
 * Requires PHP:        8.0
 * Author:              Creative Slice
 * Author URI:          https://creativeslice.com
 * Plugin URI:          https://github.com/creativeslice/cslice-table-of-contents
 * License:             GPL-2.0-or-later
 * Text Domain:         cslice-table-of-contents
 */

if ( ! defined( 'ABSPATH' ) ) { exit; } // Exit if accessed directly

/**
 * Plugin updater - PUBLIC REPO
 */
if (is_admin()) {
    require_once plugin_dir_path(__FILE__) . 'cslice-plugin-updater-public.php';
    new CSlice\TableOfContents\Plugin_Updater(
        __FILE__,
        'creativeslice/cslice-table-of-contents',
        'main'
    );
}

/**
 * Add a unique ID to each heading block
 */
add_filter('render_block', function($block_content, $block) {
    if ($block['blockName'] !== 'core/heading' || !has_block('cslice/table-of-contents', get_post()->post_content)) {
        return $block_content;
    }

    $text = wp_strip_all_tags($block_content);
    $id = sanitize_title($text);
    $level = $block['attrs']['level'] ?? 2;

    return str_replace("<h$level", "<h$level id=\"" . esc_attr($id) . "\"", $block_content);
}, 10, 2);

/**
 * Register block from block.json
 */
add_action('init', function() {
    register_block_type(__DIR__ . '/build');
});
