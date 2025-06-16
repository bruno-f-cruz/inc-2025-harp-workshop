import WorkflowContainer from "./workflow.js"

export default {
    defaultTheme: 'auto',
    iconLinks: [{
        icon: 'github',
        href: 'https://github.com/bruno-f-cruz/inc-2025-harp-workshop',
        title: 'GitHub'
    }],
    start: () => {
        WorkflowContainer.init();
    }
}