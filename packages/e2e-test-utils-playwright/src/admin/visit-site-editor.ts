/**
 * Internal dependencies
 */
import type { Admin } from './';

interface SiteEditorOptions {
	postId?: string | number;
	postType?: string;
	path?: string;
	canvas?: string;
	showWelcomeGuide?: boolean;
}

/**
 * Visits the Site Editor main page.
 *
 * @param this
 * @param options Options to visit the site editor.
 */
export async function visitSiteEditor(
	this: Admin,
	options: SiteEditorOptions = {}
) {
	const { postId, postType, path, canvas } = options;
	const query = new URLSearchParams();

	if ( postId ) query.set( 'postId', String( postId ) );
	if ( postType ) query.set( 'postType', postType );
	if ( path ) query.set( 'path', path );
	if ( canvas ) query.set( 'canvas', canvas );

	await this.visitAdminPage( 'site-editor.php', query.toString() );

	if ( ! options.showWelcomeGuide ) {
		await this.editor.setPreferences( 'core/edit-site', {
			welcomeGuide: false,
			welcomeGuideStyles: false,
			welcomeGuidePage: false,
			welcomeGuideTemplate: false,
		} );
	}

	// TODO: Ideally the content underneath the canvas loader should be marked inert until it's ready.
	await this.page
		.locator( '.edit-site-canvas-loader' )
		// Bigger timeout is needed for larger entities, for example the large
		// post html fixture that we load for performance tests, which often
		// doesn't make it under the default 10 seconds.
		.waitFor( { state: 'hidden', timeout: 60_000 } );
}
