let sommelink = null;
let sommets = [];

let dijkstra = [];
let checked = [];

$(document).ready(function()
{
    choice = 0;
    let nbsommet = 0;

    $(".page").on("click",function(e)
    {
        if(choice == 0)
        {
            posx = e.clientX - 23;
            posy = e.clientY - 23;
            $(".page").append("<div class='"+nbsommet+"'><div class='sommet' onclick='SommetClick($(this))' id='"+nbsommet+"'><p class='name'>S"+nbsommet+"</p></div></div>");
            $("#"+nbsommet).css(
            {
                left: posx,
                top: posy
            });
            
            nbsommet++;

            for(let i = 0; i < sommets.length; i++)
            {
                if(sommets[i] != null)
                {
                    sommets[i].push(null);
                }
                
            }
            sommets.push([]);
            
            for(let i = 0; i < sommets.length; i++)
            {
                sommets[nbsommet-1].push(null);
            }
        }
    });


    $(".setting").on("click",function()
    {
        $(".setting").removeClass("selected-set");
        $(this).addClass("selected-set");
    });

    $(".reset").on("click", function()
    {
        $(".page").empty();
        nbsommet = 0;
        road = [];
        sommets = [];
        sommelink = null
    });

    jQuery.fn.rotate = function(degrees) 
    {
        $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                     '-moz-transform' : 'rotate('+ degrees +'deg)',
                     '-ms-transform' : 'rotate('+ degrees +'deg)',
                     'transform' : 'rotate('+ degrees +'deg)'});
        return $(this);
    };
});

function Choice(choix)
{
    choice = choix;
}

function SommetClick(id)
{
    
    id = id.attr("id");

    if(choice == 1)
    {
        if(sommelink == null)
        {
            sommelink = id;
            $("#"+id).addClass("selected");
        }
        else if(sommelink == id)
        {
            sommelink = null;
            $("#"+id).removeClass("selected");
        }
        else
        {
            if(sommets[sommelink][id] == null)
            {
                sommets[sommelink][id] = 0;
                $("."+sommelink).append("<svg class='line n"+sommelink+"'><defs><marker id='head' orient='auto' markerWidth='3' markerHeight='4'refX='6.5' refY='2'><path class='dist"+sommelink+"-"+id+"' d='M0,0 V4 L2,2 Z' fill='black'/></marker></defs><line marker-end='url(#head)' id='"+sommelink+"-"+id+"'/></div>");
                
                var line = $("#"+sommelink+"-"+id);
                var line2 = $("#"+sommelink+"-"+id+"2");
                var div1 = $("#"+sommelink);
                var div2 = $("#"+id);

                var x1 = (div1.offset().left) + (div1.width()/2);
                var y1 = div1.offset().top + (div1.height()/2);
                var x2 = (div2.offset().left) + (div2.width()/2);
                var y2 = div2.offset().top + (div2.height()/2);
                
                line.attr('x1',x1).attr('y1',y1).attr('x2',x2).attr('y2',y2);
                line2.attr('x1',x1).attr('y1',y1).attr('x2',x2).attr('y2',y2);
                
                $("."+sommelink).append("<input type='number' value='0' class='weight "+sommelink+"-"+id+"'/>");
                $("."+sommelink+"-"+id).css(
                {
                    top: (y1+y2)/2,
                    left: (x1+x2)/2 
                });
                
                $("#"+sommelink).removeClass("selected");
                sommelink = null;
            }
        }
    }

    if(choice == 2)
    {
        $("#"+id).parent().remove();
        for(let i = 0; i < sommets.length; i++)
        {
            $("#"+i+"-"+id).parent().remove();
            $("#"+id+"-"+i).parent().remove();

            
            $("#"+i+"-"+id+"2").parent().remove();
            $("#"+id+"-"+i+"2").parent().remove();
            
        }
        sommets[id] = null; 
    }
}

function Dijkstra(hasend)
{
    var start = parseInt(window.prompt("Donnez le numéro du sommet de départ: "));
    var end = null;
    if(hasend)
    {
        end = parseInt(window.prompt("Donnez le numéro du sommet d'arrivé: "));
    }
    if(typeof(start) == "undefined" || start > sommets.length || start < 0)
    {
        alert("sommet invalide.");
    }
    else
    {
        for(let i = 0; i < sommets.length; i++)
        {
            for(let j = 0; j < sommets[i].length; j++)
            {
                sommets[i][j] = $("."+i+"-"+j).val() == "undefined" ? null : $("."+i+"-"+j).val();
            }

            dijkstra.push([null, null]);
        }

        dijkstra[start][0] = start;
        dijkstra[start][1] = 0;

        let curr = start;
    
        checked.push(curr);

        console.log(dijkstra);
    
        while(checked.length < sommets.length)
        {
            for(let i = 0; i < dijkstra.length; i++)
            {
                if(CheckSommet(i))
                {
                    let dist = parseInt(dijkstra[curr][1]) + parseInt(sommets[curr][i]);
                        
                    if(dijkstra[i][0] == null || isNaN(dijkstra[i][0]))
                    {
                        dijkstra[i][0] = curr;
                        dijkstra[i][1] = dist;
                        
                        console.log(dijkstra);
                        console.log("S"+curr+" distence: "+dist);
                    }
                    else
                    {
                        if(dijkstra[i][1] > dist || isNaN(dijkstra[i][1]))
                        {
                            dijkstra[i][0] = curr;
                            dijkstra[i][1] = dist;
                        }
                        console.log("S"+curr+" distence: "+dist);
                        console.log(dijkstra);
                    }
                }
            }

            curr = CheckMinSommet();
            
            checked.push(curr);
        }

        ColorPath(start, end);
    }
}

function ColorPath(start, end)
{
    if(end == null)
    {
        for(let i = 0; i < dijkstra.length; i++)
        {
            console.log("#"+dijkstra[i][0]+"-"+i+"2");
            $("#"+dijkstra[i][0]+"-"+i).css("stroke","red");
            $("#"+dijkstra[i][0]+"-"+i+"2").css("stroke","red");
        }
    }
    else 
    {
        let paths = [];
        for(let i = 0; i < dijkstra.length; i++)
        {
            paths.push([null , null]);
        }

        getPaths(start, end, paths);

        for(let i = 0; i < paths.length; i++)
        {
            console.log("#"+paths[i][0]+"-"+i+"2");
            $("#"+paths[i][0]+"-"+i).css("stroke","red");
            $("#"+paths[i][0]+"-"+i+"2").css("stroke","red");
        }
    }
}

function getPaths(start, curr, paths)
{
    while(curr != start)
    {
        paths[curr] = dijkstra[curr];
        curr = dijkstra[curr][0];
    }
}



function CheckMinSommet()
{
    let min = [null, null];
    for(let i = 0; i < dijkstra.length; i++)
    {
        if(CheckSommet(i))
        {
            if(min[1] == null)
            {
                min[0] = i;
                min[1] = dijkstra[i][1];
            }
            else
            {
                if(min[1] > dijkstra[i][1])
                {
                    min[0] = i;
                    min[1] = dijkstra[i][1];
                }
            }
        }
    }

    console.log(min[0]);
    return min[0];
}

function CheckSommet(ind)
{
    for(let i = 0; i < checked.length; i++)
    {
        if(ind == checked[i])
        {
            return false;
        }
    }

    return true;
}