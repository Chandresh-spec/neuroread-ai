import React from 'react';
import AccessibilityPanel from './AccessibilityPanel';
import AccountPageLayout from './AccountPageLayout';

/**
 * Full-page Accessibility view inside the shared 720px centered layout.
 */
export default function AccessibilityPage({
  accessibilityState,
  onChangeAccessibility,
  onBack,
}) {
  return (
    <AccountPageLayout
      activePage="accessibility"
      onBack={onBack}
      title="Accessibility"
      subtitle="Changes apply immediately across NeuroRead."
    >
      <AccessibilityPanel
        layout="page"
        fontMode={accessibilityState.fontMode}
        setFontMode={(v) => onChangeAccessibility({ fontMode: v })}
        textSize={accessibilityState.textSize}
        setTextSize={(v) => onChangeAccessibility({ textSize: v })}
        lineSpacing={accessibilityState.lineSpacing}
        setLineSpacing={(v) => onChangeAccessibility({ lineSpacing: v })}
        readerTheme={accessibilityState.readerTheme}
        setReaderTheme={(v) => onChangeAccessibility({ readerTheme: v })}
        focusMode={accessibilityState.focusMode}
        setFocusMode={(v) => onChangeAccessibility({ focusMode: v })}
      />
    </AccountPageLayout>
  );
}
