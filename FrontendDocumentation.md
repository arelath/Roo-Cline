# Roo Cline Frontend Architecture Guide

## Backend Message Handling: Detailed Implementation

### Message Processing in ClineProvider

The `ClineProvider` class in `src/core/webview/ClineProvider.ts` is the core of backend message handling. It uses a comprehensive `setWebviewMessageListener` method to process messages from the frontend.

#### Message Handling Pattern

```typescript
webview.onDidReceiveMessage(
  async (message: WebviewMessage) => {
    switch (message.type) {
      case "newFeatureMessage":
        // Implement feature-specific logic
        break
    }
  }
)
```

### Implementing a New Feature: Step-by-Step Guide

#### 1. Define Message Type
Update `src/shared/WebviewMessage.ts`:
```typescript
export interface WebviewMessage {
  type:
    | ... existing types
    | "newFeatureMessage"
  // Add any specific payload properties
  newFeatureData?: string
}
```

#### 2. Backend Handler in ClineProvider
In `src/core/webview/ClineProvider.ts`, add a case to `setWebviewMessageListener`:
```typescript
case "newFeatureMessage":
  // Implement feature logic
  await this.handleNewFeature(message.newFeatureData)
  await this.postStateToWebview() // Update global state if needed
  break
```

#### 3. Create Backend Method
```typescript
private async handleNewFeature(data?: string) {
  // Implement feature-specific logic
  // Example: Update global state
  await this.updateGlobalState("newFeatureKey", data)
  
  // Optional: Perform additional actions
  // - Interact with file system
  // - Call external services
  // - Update workspace configuration
}
```

#### 4. Frontend Implementation
In a React component (e.g., `NewFeatureComponent.tsx`):
```typescript
const handleFeatureAction = () => {
  vscode.postMessage({ 
    type: 'newFeatureMessage', 
    newFeatureData: 'example data' 
  })
}
```

### State Management Deep Dive

#### Global State Keys
The `GlobalStateKey` type defines all possible keys for global state:
```typescript
type GlobalStateKey = 
  | "apiProvider"
  | "customInstructions"
  | "soundEnabled"
  // ... other keys
```

#### State Retrieval and Update
```typescript
// Retrieve state
async getState() {
  const [
    apiProvider,
    customInstructions,
    // other state values
  ] = await Promise.all([
    this.getGlobalState("apiProvider"),
    this.getGlobalState("customInstructions"),
    // fetch other state values
  ])

  return {
    apiConfiguration: { 
      apiProvider, 
      // other config values 
    },
    customInstructions,
    // other state properties
  }
}

// Update state
async updateGlobalState(key: GlobalStateKey, value: any) {
  await this.context.globalState.update(key, value)
}
```

### Secret Management
```typescript
// Store sensitive information securely
private async storeSecret(key: SecretKey, value?: string) {
  if (value) {
    await this.context.secrets.store(key, value)
  } else {
    await this.context.secrets.delete(key)
  }
}
```

### Advanced Feature Implementation Example

#### Adding a New Setting: Language Preference

1. Update `WebviewMessage.ts`:
```typescript
export interface WebviewMessage {
  type:
    | ... existing types
    | "preferredLanguage"
  text?: string
}
```

2. Backend Handler in `ClineProvider.ts`:
```typescript
case "preferredLanguage":
  await this.updateGlobalState("preferredLanguage", message.text)
  await this.postStateToWebview()
  break
```

3. Frontend Component:
```typescript
const LanguageSelector = () => {
  const { preferredLanguage, setPreferredLanguage } = useExtensionState()

  const handleLanguageChange = (newLanguage: string) => {
    vscode.postMessage({ 
      type: 'preferredLanguage', 
      text: newLanguage 
    })
  }

  return (
    <select 
      value={preferredLanguage} 
      onChange={(e) => handleLanguageChange(e.target.value)}
    >
      <option value="English">English</option>
      <option value="Spanish">Spanish</option>
      {/* Add more languages */}
    </select>
  )
}
```

### Best Practices

1. Always use TypeScript for type safety
2. Keep message payloads minimal and focused
3. Handle potential undefined values
4. Use `postStateToWebview()` to sync state changes
5. Implement comprehensive error handling
6. Use secure storage for sensitive information

### Performance Considerations

- Minimize global state
- Use memoization in React components
- Lazy load complex features
- Optimize state updates

### Error Handling

```typescript
try {
  // Feature implementation
} catch (error) {
  console.error("Feature implementation error:", error)
  vscode.window.showErrorMessage("Failed to perform action")
}
```

## Conclusion

This guide provides a comprehensive approach to implementing new features in the Roo Cline VSCode extension, covering message passing, state management, and best practices for frontend and backend integration.