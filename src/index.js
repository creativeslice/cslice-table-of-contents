import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, CheckboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useEffect, useRef } from '@wordpress/element';

import './style.scss';
import metadata from './block.json';

// Edit in block-editor
const Edit = ( { attributes, setAttributes } ) => {
	const { headingLevels, headings } = attributes;
	const previousHeadings = useRef( headings );

	// Recursively get all heading blocks
	const getHeadingBlocks = ( blocks ) => {
		return blocks.reduce( ( headings, block ) => {
			if ( block.name === 'core/query' ) {
				return headings;
			}

			if (
				block.name === 'core/heading' &&
				headingLevels[ `h${ block.attributes.level }` ]
			) {
				// Create a temporary element to decode HTML entities
				const decoder = document.createElement( 'div' );
				decoder.innerHTML = block.attributes.content;
				const decodedContent = decoder.textContent;

				headings.push( {
					content: decodedContent,
					level: block.attributes.level,
					anchor: decodedContent
						.toLowerCase()
						.replace( /<[^>]*>/g, '' )
						.replace( /[^a-z0-9\s-]+/g, '' ) // match WP sanitize_title()
						.replace( /\s+/g, '-' )
						.replace( /^-+|-+$/g, '' ),
				} );
			}

			if ( block.innerBlocks?.length ) {
				headings.push( ...getHeadingBlocks( block.innerBlocks ) );
			}

			return headings;
		}, [] );
	};

	// Get headings from the content
	const headingBlocks = useSelect(
		( select ) => {
			const { getBlocks } = select( blockEditorStore );
			return getHeadingBlocks( getBlocks() );
		},
		[ headingLevels ]
	);

	// Only update attributes if headings have actually changed
	useEffect( () => {
		if (
			JSON.stringify( previousHeadings.current ) !==
			JSON.stringify( headingBlocks )
		) {
			previousHeadings.current = headingBlocks;
			setAttributes( { headings: headingBlocks } );
		}
	}, [ headingBlocks, setAttributes ] );

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'Headings to show',
						'cslice-table-of-contents'
					) }
				>
					{ [ 1, 2, 3, 4 ].map( ( level ) => (
						<CheckboxControl
							key={ level }
							label={ `H${ level }` }
							checked={ headingLevels[ `h${ level }` ] }
							onChange={ ( checked ) =>
								setAttributes( {
									headingLevels: {
										...headingLevels,
										[ `h${ level }` ]: checked,
									},
								} )
							}
						/>
					) ) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ headingBlocks?.length > 0 ? (
					<ul>
						{ headingBlocks.map( ( heading, index ) => (
							<li
								key={ index }
								className={ `level-${ heading.level }` }
							>
								<a
									href={ `#${ heading.anchor }` }
									data-toc-section={ heading.anchor }
								>
									{ heading.content }
								</a>
							</li>
						) ) }
					</ul>
				) : (
					<p>
						{ __(
							'No headings found',
							'cslice-table-of-contents'
						) }
					</p>
				) }
			</div>
		</>
	);
};

// Save the block content for rendering
const save = ( { attributes } ) => {
	const { headings } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			{ headings?.length > 0 ? (
				<ul>
					{ headings.map( ( heading, index ) => (
						<li
							key={ index }
							className={ `level-${ heading.level }` }
						>
							<a
								href={ `#${ heading.anchor }` }
								data-toc-section={ heading.anchor }
							>
								{ heading.content }
							</a>
						</li>
					) ) }
				</ul>
			) : null }
		</div>
	);
};

// Register block in editor
registerBlockType( metadata.name, {
	...metadata,
	edit: Edit,
	save,
} );
