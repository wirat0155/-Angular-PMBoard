import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface Card {
    card_id: string;
    title: string;
    description?: string;
    due_date?: string;
    assignees?: string[];
    labels?: string[];
}

interface Column {
    column_id: string;
    title: string;
    pos_index: number;
    cards: Card[];
}

interface Board {
    board_id: string;
    title: string;
    description?: string;
    owner_id: string;
    columns: Column[];
}

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [CommonModule, HttpClientModule, FormsModule, DragDropModule],
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit {
    board: Board | null = null;
    isOwner: boolean = true; // Mock owner check

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.http.get<Board>('/board-data.json')
            .subscribe(data => {
                this.board = data;
            })
    }

    drop(event: CdkDragDrop<Card[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }

    addCard(col: Column) {
        const newCard: Card = {
            card_id: `card-${Math.random()}`,
            title: 'New Task',
            description: '',
            labels: [],
            assignees: []
        };
        col.cards.push(newCard);
    }

    addColumn() {
        const newColumn: Column = {
            column_id: `col-${Math.random()}`,
            title: 'New Column',
            pos_index: this.board?.columns.length ? this.board.columns.length + 1 : 1,
            cards: []
        };
        this.board?.columns.push(newColumn);
    }

    inviteMember() {
        alert("Invite Member modal opens");
    }
}