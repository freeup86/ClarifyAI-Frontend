import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { format } from 'date-fns';

interface ActionItem {
    id: number;
    actionDescription: string;
    deadline: string | null;
    priority: number;
    status: string;
}

interface Message {
    id: number;
    source: string;
    sender: string;
    subject: string | null;
    receivedAt: string;
}

const Dashboard: React.FC = () => {
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [recentMessages, setRecentMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [actionResponse, messageResponse] = await Promise.all([
                    api.get('/action-items?limit=5&status=PENDING'),
                    api.get('/messages?limit=5')
                ]);

                setActionItems(actionResponse.data);
                setRecentMessages(messageResponse.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 5:
                return 'error';
            case 4:
                return 'warning';
            case 3:
                return 'primary';
            default:
                return 'default';
        }
    };

    const getSourceIcon = (source: string) => {
        switch (source.toUpperCase()) {
            case 'EMAIL':
                return '📧';
            case 'SLACK':
                return '🔷';
            case 'TEAMS':
                return '🔷';
            default:
                return '💬';
        }
    };

    if (loading) {
        return <Typography>Loading dashboard...</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Action Items */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Pending Action Items</Typography>
                            <Button variant="text" onClick={() => navigate('/actions')}>
                                View All
                            </Button>
                        </Box>
                        <Divider />
                        {actionItems.length > 0 ? (
                            <List>
                                {actionItems.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" alignItems="center">
                                                        <Typography variant="body1" component="span">
                                                            {item.actionDescription}
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            label={`P${item.priority}`}
                                                            color={getPriorityColor(item.priority)}
                                                            sx={{ ml: 1 }}
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    item.deadline
                                                        ? `Due: ${format(new Date(item.deadline), 'PPP')}`
                                                        : 'No deadline'
                                                }
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" sx={{ p: 2 }}>
                                No pending action items.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Recent Messages */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Recent Messages</Typography>
                            <Button variant="text" onClick={() => navigate('/messages')}>
                                View All
                            </Button>
                        </Box>
                        <Divider />
                        {recentMessages.length > 0 ? (
                            <List>
                                {recentMessages.map((message) => (
                                    <React.Fragment key={message.id}>
                                        <ListItem
                                            alignItems="flex-start"
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/messages/${message.id}`)}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" alignItems="center">
                                                        <Typography variant="body1" component="span">
                                                            {getSourceIcon(message.source)} {message.subject || 'No Subject'}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" component="span">
                                                            From: {message.sender}
                                                        </Typography>
                                                        <Typography variant="body2" component="span" sx={{ ml: 2 }}>
                                                            {format(new Date(message.receivedAt), 'PPP')}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" sx={{ p: 2 }}>
                                No recent messages.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Platform Status */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Platform Integrations
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="h5">📧</Typography>
                                    <Typography>Email</Typography>
                                    <Chip
                                        label="Configure"
                                        color="primary"
                                        size="small"
                                        onClick={() => navigate('/integrations')}
                                        sx={{ mt: 1 }}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="h5">🔷</Typography>
                                    <Typography>Slack</Typography>
                                    <Chip
                                        label="Configure"
                                        color="primary"
                                        size="small"
                                        onClick={() => navigate('/integrations')}
                                        sx={{ mt: 1 }}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="h5">🔷</Typography>
                                    <Typography>Teams</Typography>
                                    <Chip
                                        label="Configure"
                                        color="primary"
                                        size="small"
                                        onClick={() => navigate('/integrations')}
                                        sx={{ mt: 1 }}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;