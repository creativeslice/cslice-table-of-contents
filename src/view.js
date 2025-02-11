/**
 * Table of Contents active state tracking
 */
window.addEventListener( 'DOMContentLoaded', () => {
	// Only run if TOC exists on page
	const tocLinks = document.querySelectorAll( '[data-toc-section]' );
	if ( ! tocLinks.length ) return;

	let timeout;
	let observer;

	try {
		observer = new IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					if ( entry.isIntersecting ) {
						clearTimeout( timeout );
						timeout = setTimeout( () => {
							// Get the matching TOC link
							const id = entry.target.getAttribute( 'id' );
							if ( ! id ) return;

							const tocLink = document.querySelector(
								`[data-toc-section="${ id }"]`
							);
							if ( ! tocLink ) return;

							// Remove active from all links
							tocLinks.forEach( ( link ) =>
								link.classList.remove( 'active' )
							);

							// Add active to current link
							tocLink.classList.add( 'active' );

							// If in horizontal mode, scroll link into view
							const toc = tocLink.closest(
								'.is-style-horizontal'
							);
							if ( toc ) {
								/*
                                tocLink.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'nearest',
                                    inline: 'center'
                                });
                                */
								const linkLeft = tocLink.offsetLeft;
								const tocWidth = toc.clientWidth;
								const scrollLeft =
									linkLeft -
									tocWidth / 2 +
									tocLink.clientWidth / 2;

								toc.scrollTo( {
									left: scrollLeft,
									behavior: 'smooth',
								} );
							}
						}, 100 );
					}
				} );
			},
			{
				threshold: 0.5,
				rootMargin: '-100px 0px -50% 0px',
			}
		);

		// Cache tocLinks NodeList since we use it multiple times
		tocLinks.forEach( ( link ) => {
			const id = link.getAttribute( 'data-toc-section' );
			if ( ! id ) return;

			const heading = document.getElementById( id );
			if ( heading ) {
				observer.observe( heading );
			}
		} );
	} catch ( error ) {
		console.warn( 'TOC scroll tracking failed to initialize:', error );
	}

	// Cleanup on page unload
	window.addEventListener( 'unload', () => {
		if ( observer ) {
			observer.disconnect();
		}
		if ( timeout ) {
			clearTimeout( timeout );
		}
	} );
} );
