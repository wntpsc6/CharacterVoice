// 通用音频播放器生成器
function createAudioHTML(path) {
    return `<audio controls controlslist="nodownload" class="px-1">
                <source src="${path}" type="audio/wav">
            </audio>`;
}

// 轻量级 CSV 解析器
async function fetchCSVData(csvUrl) {
    try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const textData = await response.text();
        
        const lines = textData.trim().split('\n');
        if (lines.length < 2) return []; // 只有表头或为空
        
        const headers = lines[0].split('|').map(h => h.trim());
        const dataList = [];
        
        for (let i = 1; i < lines.length; i++) {
            // 简单处理|分割
            const values = lines[i].split('|');
            
            let obj = {};
            headers.forEach((h, idx) => {
                let val = values[idx] ? values[idx].trim() : "XXX"; // 如果为空显示 XXX
                if (val.startsWith('"') && val.endsWith('"')) {
                    val = val.substring(1, val.length - 1); // 去除双引号
                }
                obj[h] = val;
            });
            dataList.push(obj);
        }
        return dataList;
    } catch (error) {
        console.error(`Failed to load ${csvUrl}:`, error);
        return []; 
    }
}

// 表格 1 渲染逻辑
async function renderTable1() {
    const dataList = await fetchCSVData('table/table1-persona.txt');
    const tbody = document.querySelector('#table1 tbody');
    if(dataList.length === 0) tbody.innerHTML = '<tr><td colspan="6">No data loaded (Please ensure table/table1-persona.txt exists)</td></tr>';
    
    dataList.forEach(data => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="instruction-cell">${data.instruction || 'XXX'}<br>(trans: ${data['instruction-en'] || 'XXX'})</td>
            <td class="text-cell">${data.text || 'XXX'}</td>
            <td>${createAudioHTML(`data/CosyVoice2/${data.id}.wav`)}</td>
            <td>${createAudioHTML(`data/VoxInstruct/${data.id}.wav`)}</td>
            <td>${createAudioHTML(`data/VoiceSculptor/${data.id}.wav`)}</td>
            <td>${createAudioHTML(`data/CharacterVoice/${data.id}.wav`)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 表格 2 渲染逻辑
async function renderTable2() {
    const dataList = await fetchCSVData('table/table2-ablation.txt');
    const tbody = document.querySelector('#table2 tbody');
    if(dataList.length === 0) tbody.innerHTML = '<tr><td colspan="4">No data loaded</td></tr>';

    dataList.forEach(data => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="instruction-cell">${data.instruction || 'XXX'}<br>(trans: ${data['instruction-en'] || 'XXX'})</td>
            <td class="text-cell">${data.text || 'XXX'}</td>
            <td>${createAudioHTML(`data/Baseline/${data.id}.wav`)}</td>
            <td>${createAudioHTML(`data/CharacterVoice/${data.id}.wav`)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 表格 3 渲染逻辑 (Instruction Robustness - 包含Text列的纵向合并 Rowspan)
async function renderTable3() {
    const dataList = await fetchCSVData('table/table3-consistency.txt');
    const tbody = document.querySelector('#table3 tbody');
    if(dataList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No data loaded</td></tr>'; // 更新列数
        return;
    }

    dataList.forEach((data, index) => {
        let tr = document.createElement('tr');
        let html = `<td class="instruction-cell">${data.instruction || 'XXX'}<br>(trans: ${data['instruction-en'] || 'XXX'})</td>`;

        // 如果当前行是该文本组的第一个，则计算 rowspan 并渲染文本单元格
        const isGroupStart = index === 0 || data.text !== dataList[index - 1].text;
        if (isGroupStart) {
            // 计算后续相同文本行数
            let rowspan = 1;
            for (let j = index + 1; j < dataList.length && dataList[j].text === data.text; j++) {
                rowspan++;
            }
            html += `<td class="text-cell" rowspan="${rowspan}">${data.text || 'XXX'}</td>`;
        }

        html += `<td>${createAudioHTML(`data/consistency/${data.id}.wav`)}</td>`;
        tr.innerHTML = html;
        tbody.appendChild(tr);
    });
}

// 表格 4 渲染逻辑 (一行包含4个生成的音频)
async function renderTable4() {
    const dataList = await fetchCSVData('table/table4-diversity.txt');
    const tbody = document.querySelector('#table4 tbody');
    if(dataList.length === 0) tbody.innerHTML = '<tr><td colspan="6">No data loaded</td></tr>';

    dataList.forEach(data => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="instruction-cell">${data.instruction || 'XXX'}<br>(trans: ${data['instruction-en'] || 'XXX'})</td>
            <td class="text-cell">${data.text || 'XXX'}</td>
            <td>${createAudioHTML(`data/diversity/${data.id}-0.wav`)}</td>
            <td>${createAudioHTML(`data/diversity/${data.id}-1.wav`)}</td>
            <td>${createAudioHTML(`data/diversity/${data.id}-2.wav`)}</td>
            <td>${createAudioHTML(`data/diversity/${data.id}-3.wav`)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 页面加载完成后触发所有表格的数据请求和渲染
document.addEventListener("DOMContentLoaded", () => {
    renderTable1();
    renderTable2();
    renderTable3();
    renderTable4();
});