javascript:(function() {
    const regex_participants = /href="participant\.url.*href="https:\/\/web\.idle-mmo\.com\/@([A-Za-z0-9_]+)\?[^"]*"/g;
    const matches_participants = [];
    
    const regex_members = /<span x-text="member\.name">([A-Za-z0-9_]+)<\/span>/g;
    const matches_members = [];
    
    let match;
    
    while ((match = regex_participants.exec(document.body.innerHTML)) !== null) {
      matches_participants.push(match[1]);
    }
    
    while ((match = regex_members.exec(document.body.innerHTML)) !== null) {
      matches_members.push(match[1]);
    }
    
    const missed = matches_members.filter(item => !matches_participants.includes(item));
    str="participants:\n" + matches_participants.join(", ") + "\nmissed:\n" + missed.join(", ");
   
    prompt("lists:", str);
  })();
  