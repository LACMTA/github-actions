/**
 * Internal dependencies
 */
const debug = require( '../../debug' );

/* global GitHub, WebhookPayloadIssue */

/**
 * Add labels to newly opened issues.
 *
 * @param {WebhookPayloadIssue} payload - Issue event payload.
 * @param {GitHub}              octokit - Initialized Octokit REST client.
 */
async function triageNewIssues( payload, octokit ) {
	const { issue, repository } = payload;
	const { number, body } = issue;
	const { owner, name } = repository;

	const regex = /###\sHow\surgent\sis\sthis\sbug\s\n(\w*)\n/gm;

	let match;
	while ( ( match = regex.exec( body ) ) ) {
		const [ , priority ] = match;
		debug( `triage-new-issues: Adding label to issue #${ number }` );

		await octokit.rest.issues.addLabels( {
			owner: owner.login,
			repo: name,
			issue_number: number,
			labels: [ `Priority: ${ priority }` ],
		} );
	}
}

module.exports = triageNewIssues;
