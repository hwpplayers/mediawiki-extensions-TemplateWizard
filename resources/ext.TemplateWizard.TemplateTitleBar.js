/**
 * @class
 * @constructor
 * @param {mediaWiki.TemplateWizard.TemplateForm} templateForm
 * @param {mw.Title} title
 * @param {Object} templateData
 */
mediaWiki.TemplateWizard.TemplateTitleBar = function mediaWikiTemplateWizardTemplateTitleBar( templateForm, title, templateData ) {
	var $templateTitle, linkButton, trashButton;
	mediaWiki.TemplateWizard.TemplateTitleBar.parent.call( this );

	// Link button.
	linkButton = new OO.ui.ButtonWidget( {
		label: '',
		flags: 'progressive',
		framed: false,
		icon: 'link',
		href: title.getUrl(),
		target: '_blank'
	} );

	// Close button.
	trashButton = new OO.ui.ButtonWidget( { label: '', flags: 'destructive', framed: false, icon: 'trash' } );
	trashButton.connect( templateForm, { click: 'closeForm' } );

	// Button group.
	this.buttons = new OO.ui.ButtonGroupWidget( { items: [ linkButton, trashButton ] } );
	this.buttons.$element.addClass( 'buttons' );

	// Template title.
	$templateTitle = $( '<p>' ).addClass( 'title' ).append( title.getMainText() );

	// Put them all together.
	this.$element
		.addClass( 'ext-templatewizard-templatetitlebar' )
		.append(
			$( '<div>' ).addClass( 'title-and-buttons' ).append(
				$templateTitle,
				this.buttons.$element
			),
			this.getDescriptionElement( templateData )
		);
};

OO.inheritClass( mediaWiki.TemplateWizard.TemplateTitleBar, OO.ui.PanelLayout );

/**
 * Get the description div element, which may contain zero to two paragraphs.
 * @param {Object} templateData
 * @return {jQuery}
 */
mediaWiki.TemplateWizard.TemplateTitleBar.prototype.getDescriptionElement = function ( templateData ) {
	var $description, message, messageClass, hasTemplateData, hasParams;

	// Description div (may contain multiple paragraphs).
	$description = $( '<div>' ).addClass( 'description' );
	if ( templateData.description ) {
		// Normal description, from TemplateData.
		$description.append( $( '<p>' ).wrapInner( '<bdi>' ).text( templateData.description ) );
	} else {
		// No description. This notice may be overruled by one of the messages below.
		message = 'templatewizard-no-description';
	}

	// Add notice message where applicable. Note that a template that doesn't have templatedata may still have
	// parameters because they're being guessed from the template wikitext.
	messageClass = 'notice';
	hasTemplateData = ( templateData.notemplatedata === undefined );
	hasParams = ( templateData.params !== undefined && Object.keys( templateData.params ).length > 0 );
	if ( !hasTemplateData && !hasParams ) {
		message = 'templatewizard-no-params-without-td';
	} else if ( hasTemplateData && !hasParams ) {
		message = 'templatewizard-no-params-with-td';
		messageClass = '';
	} else if ( !hasTemplateData && hasParams ) {
		message = 'templatewizard-no-templatedata';
	}
	// Add the message if required. If no message is defined,
	// there will have been a template-provided description already appended.
	if ( message ) {
		$description.append(
			$( '<p>' )
				.addClass( messageClass )
				.html(
					mediaWiki.message(
						message,
						'https://www.mediawiki.org/wiki/Special:MyLanguage/Help:TemplateData'
					).parse()
				)
				.wrapInner( '<bdi>' )
		);
	}
	return $description;
};
