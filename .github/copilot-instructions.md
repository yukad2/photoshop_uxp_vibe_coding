<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Photoshop UXP Plugin Development Instructions

This is a Photoshop UXP (Unified Extensibility Platform) plugin project. When working on this project:

## Key Technologies
- HTML, CSS, JavaScript for UI
- Photoshop UXP APIs for integration
- Adobe's batchPlay API for advanced operations

## Development Guidelines
- Use modern JavaScript (ES6+) features
- Follow Adobe UXP best practices
- Ensure compatibility with Photoshop 2023+
- Use semantic HTML and accessible UI elements
- Follow Adobe's design guidelines for plugin UI

## Important Files
- `manifest.json` - Plugin configuration and permissions
- `index.html` - Main UI panel
- `script.js` - Plugin logic and Photoshop integration
- `styles.css` - UI styling following Adobe design patterns

## API References
- Use Photoshop DOM API for basic operations
- Use batchPlay API for advanced scripting
- Reference official UXP documentation for latest APIs
- Test all functionality within Photoshop environment

## Security Considerations
- Request minimal required permissions in manifest
- Validate user inputs properly
- Follow Adobe's security guidelines for UXP plugins
