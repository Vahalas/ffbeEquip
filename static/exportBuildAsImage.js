BuildAsImage = {
    unitLineHeight:235,
    drawTeam: function(canvas, builds) {
        canvas.height = BuildAsImage.unitLineHeight * builds.length;
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        builds.forEach((unitBuild, index) => BuildAsImage.drawBuild(ctx, unitBuild, index));
    },


drawBuild: function(ctx, unitBuild, unitLine = 0) {

        let grd = ctx.createLinearGradient(0, 0, 900, 235);
        grd.addColorStop(0, "#0000b2");
        grd.addColorStop(1, "#00002d");

        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(4, 4 + unitLine * BuildAsImage.unitLineHeight, 726, 226);

        BuildAsImage.drawImage(ctx, 'img/box.png', 0, 0 + unitLine * BuildAsImage.unitLineHeight, 730, 235);

        let x = 105;
        let y = 20 + unitLine * BuildAsImage.unitLineHeight;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.font = "italic 12px Arial";
        ctx.fillText("HP", x, y + 20);
        ctx.fillText("MP", x +100, y + 20);
        ctx.fillText("ATK", x, y + 40);
        ctx.fillText("DEF", x + 100, y + 40);
        ctx.fillText("MAG", x, y + 60);
        ctx.fillText("SPR", x +100, y + 60);

        ctx.font = "bold 16px Arial";
        ctx.textAlign = "end"
        ctx.fillText(calculateStatValue(unitBuild.build, "hp", unitBuild).total, x + 80, y + 20);
        ctx.fillText(calculateStatValue(unitBuild.build, "mp", unitBuild).total, x + 180, y + 20);
        ctx.fillText(calculateStatValue(unitBuild.build, "atk", unitBuild).total, x + 80, y + 40);
        ctx.fillText(calculateStatValue(unitBuild.build, "def", unitBuild).total, x + 180, y + 40);
        ctx.fillText(calculateStatValue(unitBuild.build, "mag", unitBuild).total, x + 80, y + 60);
        ctx.fillText(calculateStatValue(unitBuild.build, "spr", unitBuild).total, x + 180, y + 60);

        let unitId = unitBuild.unit.id;
        let iconId = unitId.substr(0,unitId.length-1) + unitBuild.unit.max_rarity;
        BuildAsImage.drawImage(ctx, `img/units/unit_ills_${iconId}.png`, 5, 5 + unitLine * BuildAsImage.unitLineHeight, 100, 100);


        if (unitBuild.build[10]) {
            BuildAsImage.drawImage(ctx, `img/espers/${escapeName(unitBuild.build[10].name)}.jpg`, x + 205, y, 50, 50);
            BuildAsImage.drawText(ctx, unitBuild.build[10].name, 'bold', 12, 'center', 'middle', x + 230, y + 60, 130);
        } else {
            BuildAsImage.drawImage(ctx, `img/espers/ALL.jpg`, x + 205, y, 50, 50);
            BuildAsImage.drawText(ctx, 'No esper', 'bold', 12, 'center', 'middle', x + 230, y + 60, 130);
        }


        ctx.textBaseline = "bottom";
        let additionalValues = [
            {"name":"Evasion", "value":calculateStatValue(unitBuild.build, "evade.physical", unitBuild).total},
            {"name":"Provoke", "value":calculateStatValue(unitBuild.build, "drawAttacks", unitBuild).total},
            {"name":"LB Dmg", "value":calculateStatValue(unitBuild.build, "lbDamage", unitBuild).total},
            {"name":"MP/turn", "value":calculateStatValue(unitBuild.build, "mpRefresh", unitBuild).total},
            {"name":"LB/turn", "value":calculateStatValue(unitBuild.build, "lbPerTurn", unitBuild).total},
            {"name":"LB fill", "value":calculateStatValue(unitBuild.build, "lbFillRate", unitBuild).total},
            {"name":"Jmp Dmg", "value":calculateStatValue(unitBuild.build, "jumpDamage", unitBuild).total},

        ];
        x = 25;
        y = 95 + unitLine * BuildAsImage.unitLineHeight;
        let line = 0;
        let column = 0;
        additionalValues.forEach(valueData => {
            if (valueData.value) {
                ctx.textAlign = "start"
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.font = "italic 12px Arial";
                ctx.fillText(valueData.name, x + column * 100, y + line * 20 + 20);
                ctx.font = "bold 14px Arial";
                ctx.textAlign = "end"
                ctx.fillText(valueData.value, x + column * 100 + 80, y + line * 20 + 20);
                column++;
                if (column == 3) {
                    line++;
                    column = 0;
                }
            }
        });

        x = 375;
        y = 5 + unitLine * BuildAsImage.unitLineHeight;

        line = 0;
        column = 0;
        for (let i = 0; i < 10; i++) {
            if (unitBuild.build[i]) {
                BuildAsImage.drawImage(ctx, `img/items/${unitBuild.build[i].icon}`, x + column * 170, y + line * 30, 40, 40);
                BuildAsImage.drawText(ctx, unitBuild.build[i].name, 'bold', 12, 'start', 'middle', x + 40 + column * 170, y + line * 30 + 20, 130);
            }
            column++;
            if (column === 2) {
                line ++;
                column = 0;
            }
        }

        let red ='#ff0000';
        let green ='#00ff00';
        x=10;
        y=164 + unitLine * BuildAsImage.unitLineHeight;
        elementList.forEach((element, index) => {
            let savedX = x;
            let savedY = y;
            let alpha = 1;
            let resist = calculateStatValue(unitBuild.build, "resist|" + element + ".percent", unitBuild).total
            if (!resist) {
                alpha = 0.4;
            }
            let color = green;
            if (resist < 0) {
                color = red;
            }

            BuildAsImage.drawImage(ctx, `img/icons/elements/${element}.png`, x + index * 30, y, 30, 30, alpha, () => {
                if (resist) {
                    ctx.font = "bold 14px Arial";
                    let textWidth = ctx.measureText(resist).width;
                    ctx.fillStyle = 'black';
                    ctx.globalAlpha = 1;
                    ctx.fillRect(savedX + 29 - textWidth + index * 30, savedY + 16, textWidth, 12);
                    BuildAsImage.drawText(ctx, resist, 'bold', 12, 'end', 'bottom', savedX + 28 + index * 30, savedY + 30, 0, color);
                }
            });
        });
        x=10;
        y=196 + unitLine * BuildAsImage.unitLineHeight;
        ailmentList.forEach((ailment, index) => {
            let savedX = x;
            let savedY = y;
            let alpha = 1;
            let resist = Math.min(100, calculateStatValue(unitBuild.build, "resist|" + ailmentList[index] + ".percent", unitBuild).total);
            if (!resist) {
                alpha = 0.4;
            }
            let color = green;
            if (resist < 0) {
                color = red;
            }
            BuildAsImage.drawImage(ctx, `img/icons/ailments/${ailment}.png`, x + index * 30, y, 30, 30, alpha, () => {
                if (resist) {
                    ctx.font = "bold 14px Arial";
                    let textWidth = ctx.measureText(resist).width;
                    ctx.fillStyle = 'black';
                    ctx.globalAlpha = 1;
                    ctx.fillRect(savedX + 29 - textWidth + index * 30, savedY + 16, textWidth, 12);
                    BuildAsImage.drawText(ctx, resist, 'bold', 12, 'end', 'bottom', savedX + 28 + index * 30, savedY + 30, 0, color);
                }
            });
        });

        let races = ['aquatic','beast','bird','bug','demon','dragon','human','machine','plant','undead','stone','spirit'];
        let physicalKillers = [75, 0, 0, 50, 100, 125, 100, 50, 50, 150, 50, 75];
        let magicalKillers = [75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 75];

        var killers = [];
        let build = unitBuild.build;
        for (var i = build.length; i--;) {
            if (build[i] && build[i].killers) {
                for (var j = 0; j < build[i].killers.length; j++) {
                    addToKiller(killers, build[i].killers[j]);
                }
            }
        }

        x = 355;
        y = 164 + unitLine * BuildAsImage.unitLineHeight;
        killerList.forEach((race, index) => {
            let savedX = x;
            let savedY = y;
            let alpha = 1;
            let killer = killers.filter(k => k.name === race);
            if (killer.length > 0) {
                killer = killer[0].physical || 0;
            } else {
                killer = 0;
            }
            if (!killer) {
                alpha = 0.4;
            }
            BuildAsImage.drawImage(ctx, `img/icons/killers/physical-${race}.png`, x + index * 30, y, 30, 30, alpha, () => {
                if (killer) {
                    ctx.font = "bold 14px Arial";
                    let textWidth = ctx.measureText(killer).width;
                    ctx.fillStyle = 'black';
                    ctx.globalAlpha = 0.5;
                    ctx.fillRect(savedX + 29 - textWidth + index * 30, savedY + 16, textWidth, 12);
                    BuildAsImage.drawText(ctx, killer, 'bold', 12, 'end', 'bottom', savedX + 28 + index * 30, savedY + 30);
                }
            });
        });

        x = 355;
        y = 196 + unitLine * BuildAsImage.unitLineHeight;
        races.forEach((race, index) => {
            let savedX = x;
            let savedY = y;
            let alpha = 1;
            let killer = killers.filter(k => k.name === race);
            if (killer.length > 0) {
                killer = killer[0].magical || 0;
            } else {
                killer = 0;
            }
            if (!killer) {
                alpha = 0.4;
            }
            BuildAsImage.drawImage(ctx, `img/icons/killers/magical-${race}.png`, x + index * 30, y, 30, 30, alpha, () => {
                if (killer) {
                    ctx.font = "bold 14px Arial";
                    let textWidth = ctx.measureText(killer).width;
                    ctx.fillStyle = 'black';
                    ctx.globalAlpha = 0.5;
                    ctx.fillRect(savedX + 29 - textWidth + index * 30, savedY + 16, textWidth, 12);
                    BuildAsImage.drawText(ctx, killer, 'bold', 12, 'end', 'bottom', savedX + 28 + index * 30, savedY + 30);
                }
            });
        });
    },

    drawImage: function(ctx, imageUrl, x, y, w, h, alpha = 1, callback) {
        let image = new Image();
        image.onload = () => {
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, x, y, w, h);
            if (callback) {
                callback();
            }
        }
        image.src = imageUrl;
    },

    drawText: function(ctx, text, style, size, textAlign, textBaseline, x, y, maxX, color = 'white'){
        let font = size + 'px Arial';
        if (style) {
            font = style + ' ' + font;
        }
        ctx.globalAlpha = 1;
        ctx.font = font;
        ctx.textBaseline = textBaseline;
        ctx.textAlign = textAlign;
        ctx.fillStyle = color;
        let lines = [];
        if (maxX) {
            lines = BuildAsImage.getLines(ctx, text, maxX);
        } else {
            lines = [text];
        }
        let baseY = 0;
        if (textBaseline === 'middle') {
            baseY = -(lines.length - 1) * (size + 2) / 2
        }
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x, baseY + y + i * (size + 2));
        }
    },

    getLines: function(ctx, text, maxWidth) {
        var words = text.split(" ");
        var lines = [];
        var currentLine = words[0];

        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
}