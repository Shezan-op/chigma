# Chigma MCP Interaction Examples

## Example 1: Create a Metric KPI Card
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "create_node",
    "arguments": {
      "type": "card",
      "x": 200,
      "y": 150,
      "customProps": {
        "title": "Monthly Recurring Revenue",
        "content": "$124,500",
        "subtitle": "+14.2% vs last month"
      }
    }
  }
}
```

## Example 2: Apply 8px Horizontal Auto-Layout
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "apply_auto_layout",
    "arguments": {
      "nodeId": "node_frame_123",
      "direction": "horizontal",
      "gap": 8,
      "paddingX": 16,
      "paddingY": 12
    }
  }
}
```

## Example 3: Export Component to React + Tailwind
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "export_code",
    "arguments": {
      "nodeId": "node_btn_456",
      "format": "react_tailwind"
    }
  }
}
```
