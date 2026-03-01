function createAudioHTML(path, flat) {
    if (flat) {
      return '<audio controls controlslist="nodownload" class="px-1" style="width: 36vw;"> <source src=' +
          path +
          ' type="audio/wav">Your browser does not support the audio element.</audio>';
    }
    return '<audio controls controlslist="nodownload" class="px-1"> <source src=' +
        path +
        ' type="audio/wav">Your browser does not support the audio element.</audio>';
}

function generateCharacterVoiceTable(tableId, dataList) {
    let table = document.getElementById(tableId);
    let nrRows = table.rows.length;
    for (let i = 1; i < nrRows; i++) {
      table.deleteRow(1);
    }
    
    for (let i = 0; i < dataList.length; i++) {
        let data = dataList[i];
        let id = data.id;
        let instruction = data.instruction;
        
        // Instruction row
        let instructionRow = table.insertRow(i * 2 + 1);
        let instructionCell = instructionRow.insertCell(0);
        instructionCell.colSpan = 4;
        instructionCell.innerHTML = instruction;
        instructionCell.style.textAlign = "left";
        instructionCell.style.fontSize = "14px";
        instructionCell.style.padding = "10px";
        instructionCell.style.backgroundColor = "#f8f9fa";
        
        // Audio row
        let audioRow = table.insertRow(i * 2 + 2);
        audioRow.style.height = '80px';
        
        // CosyVoice2 column
        let cell = audioRow.insertCell(0);
        cell.innerHTML = createAudioHTML('data/CosyVoice2-0.5B/' + id + '.wav', false);
        cell.style.textAlign = "center";
        
        // VoiceSculptor column
        cell = audioRow.insertCell(1);
        cell.innerHTML = createAudioHTML('data/VoiceSculptor/' + id + '.wav', false);
        cell.style.textAlign = "center";
        
        // mix2-v2 column
        cell = audioRow.insertCell(2);
        cell.innerHTML = createAudioHTML('data/mix2-v2/' + id + '.wav', false);
        cell.style.textAlign = "center";
        
        // mix2-bert column
        cell = audioRow.insertCell(3);
        cell.innerHTML = createAudioHTML('data/mix2-bert/' + id + '.wav', false);
        cell.style.textAlign = "center";
    }
}

// Table 1: 差不多
const table1_data = [
    {id: "20127", instruction: "一位青年男性，孤傲不羁，身为游侠，声音低沉磁性，语调从容带嘲讽。"},
    {id: "20390", instruction: "一位热血青年男性，性格坚毅，职业为革命党人，声音清朗坚定，语调激昂而深情。"},
    {id: "21346", instruction: "一位青年女性，性格清冷高洁，身为正道圣女，声音清越柔和、语调温婉沉稳。"},
    {id: "21645", instruction: "一位略带疏离感的青年女博士，性格聪慧独立，在生物科技领域工作，语速偏快而清晰。"}
];

// Table 2: mix2-bert更好的
const table2_data = [
    {id: "20040", instruction: "一位中年女性，性格温和理性，是位母亲，说话音色柔和清晰，语调平稳温和。"},
    {id: "20240", instruction: "一名幼年男孩，性格天真敏感，是学生，说话音色稚嫩、语调轻柔带怯。"},
    {id: "20363", instruction: "一位固执的老年男性，性格传统，是退休工人，声音沙哑低沉，语速偏慢。"},
    {id: "20647", instruction: "一位青感细腻，是文工团女兵，声音温和沉静，语调平缓略带怀旧。"},
    {id: "21339", instruction: "一位青年女性，机敏狡黠，身为魔门妖女，声音娇柔清甜，语调婉转妩媚。"},
    {id: "21449", instruction: "一名温和谦逊的少年，是重点高中的优等生，声音清朗温和，语速适中。"},
    {id: "22057", instruction: "一位沉稳睿智的老年男性，身为宰相，声音浑厚低沉，语调沉稳有力。"}
];

// Table 3: mix2-v2更好的
const table3_data = [
    {id: "20685", instruction: "一位幼年女孩，天真纯善，是小学生，声音清脆稚嫩，语调柔和带童真。"},
    {id: "22060", instruction: "一位中年女性，果决威严，身为帝王，声音沉稳浑厚、语调庄重。"}
];

generateCharacterVoiceTable('character_table1', table1_data);
generateCharacterVoiceTable('character_table2', table2_data);
generateCharacterVoiceTable('character_table3', table3_data);
