type FormattedMessageProps = {
  content: string;
};

export default function FormattedMessage({ content }: FormattedMessageProps) {
  // Parse and format the content
  const formatContent = (text: string) => {
    // Split by double newlines (paragraphs)
    const sections = text.split('\n\n');
    
    return sections.map((section, index) => {
      // Check if it's a heading (starts with ** or all caps followed by **)
      const isHeading = /^\*\*.*\*\*$/m.test(section.trim()) || 
                       /^[A-Z\s]+\*\*$/m.test(section.trim());
      
      if (isHeading) {
        // Extract text between ** markers
        const headingText = section.replace(/\*\*/g, '').trim();
        return (
          <h3 key={index} className="font-bold text-lg mt-4 mb-2">
            {headingText}
          </h3>
        );
      }
      
      // Check if it's a numbered/bulleted list
      if (/^\d+\.\s/.test(section.trim()) || /^-\s/.test(section.trim())) {
        const items = section.split('\n').filter(item => item.trim());
        return (
          <ul key={index} className="list-none space-y-2 ml-4 my-2">
            {items.map((item, i) => {
              const cleanItem = item.replace(/^\d+\.\s/, '').replace(/^-\s/, '').replace(/\*\*/g, '');
              return (
                <li key={i} className="text-gray-800">
                  • {cleanItem}
                </li>
              );
            })}
          </ul>
        );
      }
      
      // Regular paragraph - make bold text within paragraphs
      const formattedText = section.split('\n').map((line, i) => {
        // Handle inline bold (text between **)
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <span key={i}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j}>{part.replace(/\*\*/g, '')}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
            {i < section.split('\n').length - 1 && <br />}
          </span>
        );
      });
      
      return (
        <p key={index} className="mb-3 leading-relaxed">
          {formattedText}
        </p>
      );
    });
  };

  return <div className="formatted-content">{formatContent(content)}</div>;
}