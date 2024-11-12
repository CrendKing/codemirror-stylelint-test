import { basicSetup, EditorView } from 'codemirror'
import { css } from '@codemirror/lang-css'
import { EditorState } from '@codemirror/state'
import { linter } from '@codemirror/lint'
import stylelint from './stylelint-bundle.min.js';

const myLinter = linter(function (view) {
    let diagnostics = []

    stylelint.lint({
        config: {
            rules: {
                'property-no-unknown': true,
            }
        },
        code: view.state.doc.toString(),
    }).then(function (result) {
        for (const ret of result.results) {
            for (const warning of ret.warnings) {
                diagnostics.push({
                    from: warning.line,
                    to: warning.line + 1,
                    severity: 'warning',
                    message: warning.text,
                })
            }
        }
    }).catch(console.error)

    return diagnostics
})

new EditorView({
    parent: document.querySelector(`#editor`),
    state: EditorState.create({
        extensions: [basicSetup, css(), myLinter],
        doc: `.a {
    width1: 100px;

    .b {
        height1: 100%;
    }
}`
    })
})
