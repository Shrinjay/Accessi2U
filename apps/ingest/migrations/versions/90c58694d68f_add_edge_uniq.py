"""add edge uniq

Revision ID: 90c58694d68f
Revises: 538c92eb5351
Create Date: 2025-02-16 20:19:14.664030

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '90c58694d68f'
down_revision: Union[str, None] = '538c92eb5351'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint('uix_edge_room_building_floor', 'edge', ['room_id', 'building_id', 'floor_id'])
    op.create_unique_constraint('uix_node_room_building_floor', 'node', ['room_id', 'building_id', 'floor_id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('uix_node_room_building_floor', 'node', type_='unique')
    op.drop_constraint('uix_edge_room_building_floor', 'edge', type_='unique')
    # ### end Alembic commands ###
